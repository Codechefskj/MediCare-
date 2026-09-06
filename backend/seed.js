// Seeds the database with a demo admin user and a handful of doctors.
// Run with: npm run seed
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const doctors = [
  {
    name: 'Dr. Anita Sharma',
    image: 'https://i.pravatar.cc/300?img=47',
    specialization: 'Cardiology',
    experience: 12,
    qualification: 'MBBS, MD (Cardiology)',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTime: '10:00 AM - 04:00 PM',
    consultationFee: 900
  },
  {
    name: 'Dr. Rohan Verma',
    image: 'https://i.pravatar.cc/300?img=12',
    specialization: 'Dermatology',
    experience: 8,
    qualification: 'MBBS, MD (Dermatology)',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTime: '11:00 AM - 05:00 PM',
    consultationFee: 700
  },
  {
    name: 'Dr. Priya Nair',
    image: 'https://i.pravatar.cc/300?img=45',
    specialization: 'Pediatrics',
    experience: 15,
    qualification: 'MBBS, MD (Pediatrics)',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTime: '09:00 AM - 01:00 PM',
    consultationFee: 600
  },
  {
    name: 'Dr. Karan Mehta',
    image: 'https://i.pravatar.cc/300?img=14',
    specialization: 'Orthopedics',
    experience: 10,
    qualification: 'MBBS, MS (Orthopedics)',
    availableDays: ['Wed', 'Thu', 'Sat'],
    availableTime: '02:00 PM - 08:00 PM',
    consultationFee: 800
  },
  {
    name: 'Dr. Neha Kapoor',
    image: 'https://i.pravatar.cc/300?img=32',
    specialization: 'Neurology',
    experience: 14,
    qualification: 'MBBS, DM (Neurology)',
    availableDays: ['Mon', 'Thu'],
    availableTime: '10:00 AM - 02:00 PM',
    consultationFee: 1200
  },
  {
    name: 'Dr. Sameer Joshi',
    image: 'https://i.pravatar.cc/300?img=51',
    specialization: 'General Medicine',
    experience: 6,
    qualification: 'MBBS, MD (General Medicine)',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTime: '08:00 AM - 12:00 PM',
    consultationFee: 500
  }
];

const seed = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: 'admin@hospital.com' });
  if (!existingAdmin) {
    await User.create({
      fullName: 'System Admin',
      email: 'admin@hospital.com',
      password: 'admin123',
      phone: '9999999999',
      gender: 'other',
      role: 'admin'
    });
    console.log('Admin user created: admin@hospital.com / admin123');
  } else {
    console.log('Admin user already exists, skipping.');
  }

  await Doctor.deleteMany({});
  await Doctor.insertMany(doctors);
  console.log(`Seeded ${doctors.length} doctors.`);

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
