const User = require('../models/User');
const Appointment = require('../models/Appointment');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/patients (admin only) — manage patients, with search + pagination
const getPatients = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const query = { role: 'patient' };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' }},
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await User.countDocuments(query);
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

  const patients = await User.find(query)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const patientsWithStats = await Promise.all(
    patients.map(async (p) => {
      const appointmentCount = await Appointment.countDocuments({ patient: p._id });
      return { ...p.toObject(), appointmentCount };
    })
  );

  res.status(200).json({
    success: true,
    count: patientsWithStats.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    patients: patientsWithStats
  });
});

// @route PUT /api/patients/:id/status (admin only) — activate/deactivate a patient account
const updatePatientStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const patient = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'patient' },
    { isActive },
    { new: true }
  );

  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  res.status(200).json({
    success: true,
    message: `Patient account ${isActive ? 'activated' : 'deactivated'}`,
    patient
  });
});

module.exports = { getPatients, updatePatientStatus };