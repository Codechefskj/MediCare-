const { validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const asyncHandler = require('../utils/asyncHandler');
const { generateSlotsFromRange, getDayCode, isDateInPast } = require('../utils/timeSlots');

const ACTIVE_STATUSES = ['pending', 'confirmed'];

// Explicit state machine — the backend is the final authority on which
// status changes are legal, regardless of what the client sends.
const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  rejected: [],
  cancelled: []
};

// @route POST /api/appointments (patient)
const createAppointment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }

  const { doctorId, date, time, reason } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }
  if (!doctor.isActive) {
    return res.status(400).json({ success: false, message: 'This doctor is currently inactive and not accepting bookings' });
  }

  // Backend is the final authority — never trust the frontend's own checks.
  if (isDateInPast(date)) {
    return res.status(400).json({ success: false, message: 'Appointment date cannot be in the past' });
  }

  const requestedDay = getDayCode(date);
  if (!doctor.availableDays.includes(requestedDay)) {
    return res.status(400).json({
      success: false,
      message: `Dr. ${doctor.name.replace('Dr. ', '')} is not available on ${requestedDay}s. Available days: ${doctor.availableDays.join(', ')}`
    });
  }

  const validSlots = generateSlotsFromRange(doctor.availableTime);
  if (!validSlots.includes(time)) {
    return res.status(400).json({
      success: false,
      message: `${time} is outside Dr. ${doctor.name.replace('Dr. ', '')}'s working hours (${doctor.availableTime})`
    });
  }

  // Friendly pre-check (fast path) — the unique partial index below is the real guarantee.
  const clash = await Appointment.findOne({ doctor: doctorId, date, time, status: { $in: ACTIVE_STATUSES } });
  if (clash) {
    return res.status(409).json({
      success: false,
      message: 'This slot has just been booked. Please select another slot.'
    });
  }

  try {
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
      status: 'pending'
    });
    const populated = await appointment.populate('doctor', 'name specialization consultationFee image');
    res.status(201).json({ success: true, message: 'Appointment requested successfully', appointment: populated });
  } catch (err) {
    // Race condition caught by the DB-level unique partial index
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This slot has just been booked. Please select another slot.'
      });
    }
    throw err;
  }
});

// @route GET /api/doctors/:id/slots?date=YYYY-MM-DD  (defined in doctorRoutes, logic lives here for cohesion)
const getDoctorAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  const doctor = await Doctor.findById(id);
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  if (!date) {
    return res.status(400).json({ success: false, message: 'A date query parameter is required' });
  }

  const day = getDayCode(date);
  const isAvailableDay = doctor.availableDays.includes(day) && !isDateInPast(date);

  const allSlots = isAvailableDay ? generateSlotsFromRange(doctor.availableTime) : [];

  const booked = isAvailableDay
    ? await Appointment.find({ doctor: id, date, status: { $in: ACTIVE_STATUSES } }).distinct('time')
    : [];

  const slots = allSlots.map((time) => ({ time, status: booked.includes(time) ? 'booked' : 'available' }));

  res.status(200).json({ success: true, day, isAvailableDay, slots });
});

// @route GET /api/appointments — patient sees own; admin sees all (with pagination + filters)
const getAppointments = asyncHandler(async (req, res) => {
  const { status, doctorId, search, page = 1, limit = 10 } = req.query;
  const query = {};

  if (req.user.role !== 'admin') {
    query.patient = req.user._id;
  }

  if (status) query.status = status;
  if (doctorId) query.doctor = doctorId;

  let appointments = await Appointment.find(query)
    .populate('doctor', 'name specialization consultationFee image')
    .populate('patient', 'fullName email phone')
    .sort({ createdAt: -1 });

  if (search) {
    const s = search.toLowerCase();
    appointments = appointments.filter(
      (a) =>
        a.doctor?.name?.toLowerCase().includes(s) ||
        a.patient?.fullName?.toLowerCase().includes(s) ||
        a.reason?.toLowerCase().includes(s)
    );
  }

  const total = appointments.length;
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const paginated = appointments.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.status(200).json({
    success: true,
    count: paginated.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    appointments: paginated
  });
});

// @route GET /api/appointments/:id
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('doctor', 'name specialization consultationFee image')
    .populate('patient', 'fullName email phone');

  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  const isOwner = appointment.patient._id.toString() === req.user._id.toString();
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this appointment' });
  }

  res.status(200).json({ success: true, appointment });
});

// @route PUT /api/appointments/:id (patient can update date/time/reason while pending)
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  const isOwner = appointment.patient.toString() === req.user._id.toString();
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ success: false, message: 'Not authorized to modify this appointment' });
  }

  if (appointment.status !== 'pending' && req.user.role !== 'admin') {
    return res.status(400).json({ success: false, message: 'Only pending appointments can be edited' });
  }

  const { date, time, reason } = req.body;
  if (date) appointment.date = date;
  if (time) appointment.time = time;
  if (reason) appointment.reason = reason;

  try {
    await appointment.save();
    res.status(200).json({ success: true, message: 'Appointment updated successfully', appointment });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'That slot is already taken. Please choose another.' });
    }
    throw err;
  }
});

// @route DELETE /api/appointments/:id (cancel — patient can cancel own upcoming appointment)
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  const isOwner = appointment.patient.toString() === req.user._id.toString();
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
  }

  if (!ALLOWED_TRANSITIONS[appointment.status]?.includes('cancelled')) {
    return res.status(400).json({ success: false, message: `An appointment that is already ${appointment.status} cannot be cancelled` });
  }

  appointment.status = 'cancelled';
  await appointment.save();
  res.status(200).json({ success: true, message: 'Appointment cancelled successfully', appointment });
});

// @route PUT /api/appointments/:id/status (admin only — enforces the state machine)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status: newStatus } = req.body;
  const allowed = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
  if (!allowed.includes(newStatus)) {
    return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  const currentStatus = appointment.status;
  if (currentStatus === newStatus) {
    return res.status(400).json({ success: false, message: `Appointment is already ${newStatus}` });
  }
  if (!ALLOWED_TRANSITIONS[currentStatus].includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: `Cannot change status from '${currentStatus}' to '${newStatus}'. Allowed next steps: ${
        ALLOWED_TRANSITIONS[currentStatus].join(', ') || 'none (final state)'
      }`
    });
  }

  appointment.status = newStatus;
  await appointment.save();
  await appointment.populate('doctor', 'name specialization');
  await appointment.populate('patient', 'fullName email');

  res.status(200).json({ success: true, message: `Appointment marked as ${newStatus}`, appointment });
});

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getDoctorAvailability
};