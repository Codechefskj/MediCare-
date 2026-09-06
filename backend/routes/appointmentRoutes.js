const express = require('express');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { appointmentValidator } = require('../utils/validators');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, appointmentValidator, createAppointment);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);
router.put('/:id/status', protect, authorize('admin'), updateAppointmentStatus);

module.exports = router;
