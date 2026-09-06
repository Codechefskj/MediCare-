const { validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/doctors
// Supports: search (name/specialization), specialization filter, availableDay filter,
// sortBy (fee | experience | name), order (asc | desc), pagination
const getDoctors = asyncHandler(async (req, res) => {
  const { search, specialization, availableDay, sortBy, order, page = 1, limit = 12, includeInactive } = req.query;

  const query = {};
  if (!includeInactive) query.isActive = true;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } }
    ];
  }

  if (specialization) {
    query.specialization = { $regex: `^${specialization}$`, $options: 'i' };
  }

  if (availableDay) {
    query.availableDays = availableDay;
  }

  const sortFieldMap = { fee: 'consultationFee', experience: 'experience', name: 'name' };
  const sortField = sortFieldMap[sortBy] || 'name';
  const sortOrder = order === 'desc' ? -1 : 1;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 12, 1);

  const [doctors, total] = await Promise.all([
    Doctor.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Doctor.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: doctors.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    doctors
  });
});

// @route GET /api/doctors/:id
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }
  res.status(200).json({ success: true, doctor });
});

// @route POST /api/doctors (admin only)
const createDoctor = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  const doctor = await Doctor.create(req.body);
  res.status(201).json({ success: true, message: 'Doctor added successfully', doctor });
});

// @route PUT /api/doctors/:id (admin only)
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }
  res.status(200).json({ success: true, message: 'Doctor updated successfully', doctor });
});

// @route DELETE /api/doctors/:id (admin only)
// Soft-delete: a doctor with appointment history is deactivated, not erased, so
// past appointments keep a meaningful doctor reference instead of pointing at nothing.
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  const hasHistory = await Appointment.exists({ doctor: doctor._id });

  if (hasHistory) {
    doctor.isActive = false;
    await doctor.save();
    return res.status(200).json({
      success: true,
      message: 'Doctor has existing appointment history, so the profile was deactivated instead of deleted',
      doctor
    });
  }

  await doctor.deleteOne();
  res.status(200).json({ success: true, message: 'Doctor removed successfully' });
});

// @route PUT /api/doctors/:id/status (admin only) — reactivate/deactivate
const updateDoctorStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }
  res.status(200).json({ success: true, message: `Doctor ${isActive ? 'activated' : 'deactivated'}`, doctor });
});

// @route GET /api/doctors/meta/specializations
const getSpecializations = asyncHandler(async (req, res) => {
  const specializations = await Doctor.distinct('specialization', { isActive: true });
  res.status(200).json({ success: true, specializations });
});

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorStatus,
  getSpecializations
};
