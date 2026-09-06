const { body } = require('express-validator');

const registerValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female or other'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => new Date(value) <= new Date())
    .withMessage('Date of birth cannot be in the future')
];

const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

const doctorValidator = [
  body('name').trim().notEmpty().withMessage('Doctor name is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('experience').isFloat({ min: 0 }).withMessage('Experience must be a positive number'),
  body('qualification').trim().notEmpty().withMessage('Qualification is required'),
  body('consultationFee').isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number')
];

const appointmentValidator = [
  body('doctorId').notEmpty().withMessage('Doctor is required'),
  body('date').notEmpty().withMessage('Appointment date is required'),
  body('time').notEmpty().withMessage('Appointment time is required'),
  body('reason').trim().notEmpty().withMessage('Reason for visit is required')
];

module.exports = { registerValidator, loginValidator, doctorValidator, appointmentValidator };
