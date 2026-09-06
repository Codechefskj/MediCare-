const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: [true, 'Appointment date is required'] }, // YYYY-MM-DD
    time: { type: String, required: [true, 'Appointment time is required'] },
    reason: { type: String, required: [true, 'Reason for visit is required'], trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// DB-level guarantee against double-booking: MongoDB itself rejects a second
// active (pending/confirmed) appointment for the same doctor/date/time, closing
// the race-condition window that an application-level check alone can't cover.
appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
    name: 'unique_active_slot'
  }
);

// Speeds up "my appointments" and admin filtering
appointmentSchema.index({ patient: 1, status: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
