const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Doctor name is required'], trim: true },
    specialization: { type: String, required: [true, 'Specialization is required'], trim: true, index: true },
    experience: { type: Number, required: [true, 'Experience (years) is required'], min: 0 },
    qualification: { type: String, required: [true, 'Qualification is required'], trim: true },
    availableDays: {
      type: [String],
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      default: []
    },
    availableTime: { type: String, default: '09:00 AM - 05:00 PM' },
    consultationFee: { type: Number, required: [true, 'Consultation fee is required'], min: 0 },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

doctorSchema.index({ name: 'text', specialization: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);
