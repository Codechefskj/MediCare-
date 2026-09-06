# MediCare+ — Online Hospital Appointment & Patient Management System

A full-stack hospital appointment management application built with **React, Node.js, Express.js, MongoDB, and JWT authentication**.

The system supports two roles:

- **Patient** — register, log in, discover doctors, search/filter doctors, view doctor details, check live appointment slots, book appointments, and manage appointment history.
- **Admin** — manage doctors and patients, view appointments, and approve/reject/complete/cancel appointments according to the appointment workflow.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Screenshots](#screenshots)
5. [System Architecture](#system-architecture)
6. [Project Structure](#project-structure)
7. [Database Design](#database-design)
8. [Authentication and Authorization](#authentication-and-authorization)
9. [Appointment Workflow](#appointment-workflow)
10. [Appointment Slot Management](#appointment-slot-management)
11. [Validation and Error Handling](#validation-and-error-handling)
12. [Prerequisites](#prerequisites)
13. [Installation and Setup](#installation-and-setup)
14. [MongoDB Configuration](#mongodb-configuration)
15. [Environment Variables](#environment-variables)
16. [Running the Application](#running-the-application)
17. [Database Seeding](#database-seeding)
18. [Demo Credentials](#demo-credentials)
19. [REST API Documentation](#rest-api-documentation)
20. [Responsive UI and UX](#responsive-ui-and-ux)
21. [Security Practices](#security-practices)
22. [Testing Checklist](#testing-checklist)
23. [Assignment Requirement Coverage](#assignment-requirement-coverage)
24. [Troubleshooting](#troubleshooting)
25. [Production Notes](#production-notes)
26. [License](#license)

---

## Project Overview

**MediCare+** is an online hospital appointment and patient management system.

The application provides a complete workflow from patient registration to appointment booking and administration:

```text
Patient
   |
   v
Register / Login
   |
   v
Patient Dashboard
   |
   v
Doctor Catalogue
   |
   +--> Search
   +--> Filter
   +--> Sort
   +--> Pagination
   |
   v
Doctor Details
   |
   v
Check Doctor Availability
   |
   v
Select Date + Available Time
   |
   v
Book Appointment
   |
   v
My Appointments
```

Administrative workflow:

```text
Admin Login
    |
    v
Admin Dashboard
    |
    +--> Manage Doctors
    |      +--> Add
    |      +--> Edit
    |      +--> Activate / Deactivate
    |      +--> Delete where appropriate
    |
    +--> Manage Patients
    |      +--> Search
    |      +--> Activate / Deactivate
    |
    +--> Manage Appointments
           +--> View
           +--> Approve
           +--> Reject
           +--> Complete
           +--> Cancel
```

---

## Key Features

### Patient Features

- Patient registration
- Client-side and server-side validation
- JWT-based login
- Protected routes
- Logout
- Patient dashboard
- Doctor catalogue
- Doctor search
- Specialization filtering
- Availability-day filtering
- Sorting by name, experience, and consultation fee
- Pagination
- Doctor details page
- Doctor profile images with fallback avatar
- Live appointment slot generation based on doctor availability
- Book appointment
- Duplicate appointment prevention
- My Appointments
- Appointment search and status filters
- Appointment details modal
- Appointment cancellation
- Loading states
- Empty states
- Toast success/error messages
- Responsive interface

### Admin Features

- Admin authentication
- Role-based authorization
- Admin dashboard
- Live doctor, patient, and appointment statistics
- Doctor CRUD
- Doctor activation/deactivation
- Soft-delete behavior for doctors with appointment history
- Patient search
- Patient activation/deactivation
- Appointment management
- Appointment status transitions
- Appointment details modal
- Pagination
- Confirmation dialogs
- Per-action loading states

---

## Technology Stack

| Layer               | Technology         |
|---------------------|---------------------|
| Frontend            | React 18            |
| Build Tool          | Vite                |
| Routing             | React Router v6     |
| HTTP Client         | Axios               |
| Styling             | Tailwind CSS        |
| Backend             | Node.js             |
| Web Framework       | Express.js          |
| API Style           | REST                |
| Database            | MongoDB             |
| ODM                 | Mongoose            |
| Authentication      | JWT                 |
| Password Hashing    | bcryptjs            |
| Validation          | express-validator   |
| Logging             | Morgan              |
| Development Server  | Nodemon             |

---

## Screenshots

The following screenshots demonstrate the main patient workflow of the MediCare+ application.

<table>
<tr>
<td align="center"><strong>1. Login Page</strong><br><br><img src="Utility/loginpage.png" alt="Login Page" width="420"></td>
<td align="center"><strong>2. Patient Dashboard</strong><br><br><img src="Utility/dashboard.png" alt="Patient Dashboard" width="420"></td>
</tr>
<tr>
<td align="center"><strong>3. Find Doctors</strong><br><br><img src="Utility/finddoctor.png" alt="Find Doctors" width="420"></td>
<td align="center"><strong>4. Doctor Details</strong><br><br><img src="Utility/doctordetails.png" alt="Doctor Details" width="420"></td>
</tr>
<tr>
<td align="center"><strong>5. Book Appointment</strong><br><br><img src="Utility/bookappointed.png" alt="Book Appointment" width="420"></td>
<td></td>
</tr>
</table>

### Patient Workflow

**Login → Dashboard → Find Doctors → Doctor Details → Book Appointment → My Appointments**

---

## System Architecture

```text
                         ┌─────────────────────┐
                         │       Browser        │
                         │  React Application    │
                         │   Vite + Tailwind     │
                         └──────────┬───────────┘
                                    │
                                  Axios
                                    │
                            Bearer JWT Token
                                    │
                                    v
                         ┌─────────────────────┐
                         │    Express Server    │
                         │      REST API         │
                         ├─────────────────────┤
                         │ Routes                │
                         │ Middleware            │
                         │ Controllers           │
                         │ Validation            │
                         │ Error Handling        │
                         └──────────┬───────────┘
                                    │
                                 Mongoose
                                    │
                                    v
                         ┌─────────────────────┐
                         │       MongoDB         │
                         ├─────────────────────┤
                         │ users                 │
                         │ doctors               │
                         │ appointments          │
                         └─────────────────────┘
```

---

## Project Structure

```text
hospital-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   └── patientController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── patientRoutes.js
│   │
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   ├── timeSlots.js
│   │   └── validators.js
│   │
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── AppointmentDetailsModal.jsx
│       │   ├── ConfirmContext.jsx
│       │   ├── DoctorCard.jsx
│       │   ├── DoctorImage.jsx
│       │   ├── EmptyState.jsx
│       │   ├── Loader.jsx
│       │   ├── Navbar.jsx
│       │   ├── Pagination.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── Toast.jsx
│       │   └── ToastContext.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── AdminAppointments.jsx
│       │   │   ├── AdminDoctors.jsx
│       │   │   ├── AdminOverview.jsx
│       │   │   └── AdminPatients.jsx
│       │   ├── BookAppointment.jsx
│       │   ├── DoctorCatalogue.jsx
│       │   ├── DoctorDetails.jsx
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── MyAppointments.jsx
│       │   ├── NotFound.jsx
│       │   ├── PatientDashboard.jsx
│       │   └── Register.jsx
│       ├── styles/
│       │   └── index.css
│       ├── App.jsx
│       └── main.jsx
│
└── README.md
```

---

## Database Design

The application uses three MongoDB collections.

### `users`

Stores both patients and administrators.

Important fields:

```text
_id
fullName
email
password
phone
dateOfBirth
gender
address
role
isActive
createdAt
updatedAt
```

Roles:

```text
patient
admin
```

Passwords are hashed using `bcryptjs` before storage.

### `doctors`

Stores doctor profiles and availability.

Important fields:

```text
_id
name
image
specialization
experience
qualification
availableDays
availableTime
consultationFee
isActive
createdAt
updatedAt
```

### `appointments`

Stores patient-doctor appointment relationships.

Important fields:

```text
_id
patient
doctor
date
time
reason
status
createdAt
updatedAt
```

Appointment statuses:

```text
pending
confirmed
rejected
completed
cancelled
```

### Database Indexes

The appointment collection contains a database-level unique partial index on:

```text
doctor + date + time
```

for active appointments (`pending` and `confirmed`).

This provides database-level protection against two patients successfully booking the same active slot at the same time.

Supporting indexes are also used for common appointment queries.

---

## Authentication and Authorization

The application uses **JWT authentication**.

### Authentication flow

```text
Login
  |
  v
Backend verifies credentials
  |
  v
JWT generated
  |
  v
Frontend stores token
  |
  v
Axios interceptor adds:
Authorization: Bearer <token>
```

### Authorization

Protected backend routes use:

```text
protect
```

for authentication and:

```text
authorize('admin')
```

for administrator-only operations.

Examples:

- Patients can create and manage their own appointments.
- Admins can manage doctors.
- Admins can manage patients.
- Admins can change appointment status.

---

## Appointment Workflow

The backend enforces valid appointment state transitions.

```text
                 ┌─────────────┐
                 │   PENDING   │
                 └──────┬──────┘
                        │
             ┌──────────┼──────────┐
             v          v          v
        CONFIRMED   REJECTED   CANCELLED
             |
        ┌────┴─────┐
        v          v
   COMPLETED   CANCELLED
```

Terminal states:

```text
completed
rejected
cancelled
```

These states cannot be moved to an invalid previous state. This keeps appointment history consistent.

---

## Appointment Slot Management

Appointment times are **not** a single hard-coded list shared by every doctor.

The application generates slots from the doctor's configured:

- Available days
- Available time range

Endpoint:

```http
GET /api/doctors/:id/slots?date=YYYY-MM-DD
```

The response indicates whether the doctor works on that date and returns the generated slots with their current status.

Typical slot states:

```text
Available
Booked
```

The booking flow then:

1. Checks the selected date.
2. Checks whether the doctor works that weekday.
3. Generates slots from the doctor's working hours.
4. Identifies already-booked active slots.
5. Validates the booking again on the server.
6. Creates the appointment.
7. Uses the MongoDB unique partial index as the final protection against race-condition double booking.

---

## Validation and Error Handling

Validation exists at both frontend and backend levels.

### Registration validation

Includes checks for:

- Required fields
- Valid email format
- Password requirements
- Matching confirmation password
- Phone number
- Date of birth
- Gender
- Address
- Future date of birth rejection

### Doctor validation

Includes validation of:

- Name
- Specialization
- Experience
- Qualification
- Available days
- Available time
- Consultation fee
- Image URL where supplied

### Appointment validation

The backend verifies important business rules such as:

- Doctor exists
- Doctor is active
- Appointment date is not in the past
- Doctor works on the selected weekday
- Requested time falls within the doctor's working hours
- Slot is not already occupied by an active appointment

### Error handling

The backend includes:

- `notFound` middleware
- Centralized `errorHandler`
- `asyncHandler`
- Validation error responses
- Duplicate-key handling for appointment slot conflicts
- Appropriate HTTP status codes

The frontend displays API errors through toast notifications and provides loading/empty states.

---

## Prerequisites

Install the following before running the project:

- **Node.js** (LTS recommended)
- **npm**
- **MongoDB**, either:
  - MongoDB Atlas, or
  - MongoDB Community Server running locally

Recommended:

- Visual Studio Code
- MongoDB Compass for viewing the database

---

## Installation and Setup

Clone/download the project and open the project directory:

```bash
cd hospital-system
```

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

On Windows Command Prompt:

```cmd
copy .env.example .env
```

Edit `.env` with your MongoDB connection string and JWT secret.

### Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
```

On Windows Command Prompt:

```cmd
copy .env.example .env
```

---

## MongoDB Configuration

### Option A — MongoDB Atlas

For Atlas, your backend `.env` should contain a URI similar to:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/hospital_appointment_system
```

Replace:

```text
USERNAME
PASSWORD
YOUR_CLUSTER
```

with the credentials and cluster hostname from your MongoDB Atlas connection string.

Make sure the Atlas database user has the required database permissions and your current IP address is allowed in the Atlas network access settings.

### Option B — Local MongoDB

If MongoDB is installed locally:

```env
MONGO_URI=mongodb://127.0.0.1:27017/hospital_appointment_system
```

Start MongoDB before starting the backend.

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hospital_appointment_system
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Important

Do **not** commit real `.env` files containing:

- MongoDB passwords
- JWT secrets
- API keys
- Other credentials

Only commit `.env.example`.

---

## Running the Application

The backend and frontend run separately.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is running"
}
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

## Database Seeding

The backend provides a seed script:

```bash
npm run seed
```

The seed script creates:

- One demo administrator
- Six sample doctors

The sample doctors include:

- Doctor name
- Doctor image
- Specialization
- Experience
- Qualification
- Available days
- Available time
- Consultation fee

### Warning

The seed script clears the existing doctor collection before inserting the sample doctors.

Do not run the seed command against a database containing doctor data you want to preserve.

---

## Demo Credentials

### Admin

```text
Email:    admin@hospital.com
Password: admin123
```

### Patient

Create a patient account using:

```text
Sign Up → Register → Login
```

For a production deployment, replace demo credentials and use strong secrets/passwords.

---

## REST API Documentation

Base URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint         | Authentication | Description                    |
|--------|------------------|-----------------|--------------------------------|
| POST   | `/auth/register` | Public          | Register a patient             |
| POST   | `/auth/login`    | Public          | Login                           |
| GET    | `/auth/me`       | Bearer JWT      | Get current authenticated user |

### Doctors

| Method | Endpoint                             | Authentication | Description                            |
|--------|---------------------------------------|-----------------|-----------------------------------------|
| GET    | `/doctors`                            | Public          | List/search/filter/sort doctors         |
| GET    | `/doctors/:id`                        | Public          | Get doctor details                      |
| GET    | `/doctors/:id/slots?date=YYYY-MM-DD`  | Public          | Get date-specific availability          |
| GET    | `/doctors/meta/specializations`       | Public          | Get specializations for filtering       |
| POST   | `/doctors`                            | Admin           | Create doctor                           |
| PUT    | `/doctors/:id`                        | Admin           | Update doctor                           |
| PUT    | `/doctors/:id/status`                 | Admin           | Activate/deactivate doctor              |
| DELETE | `/doctors/:id`                        | Admin           | Delete/deactivate doctor per history    |

Doctor list query parameters include:

```text
search
specialization
availableDay
sortBy
order
page
limit
```

### Appointments

| Method | Endpoint                  | Authentication | Description                        |
|--------|----------------------------|-----------------|-------------------------------------|
| POST   | `/appointments`            | Authenticated   | Create appointment                  |
| GET    | `/appointments`            | Authenticated   | Get appointments for current role   |
| GET    | `/appointments/:id`        | Owner/Admin     | Get appointment details             |
| PUT    | `/appointments/:id`        | Owner/Admin     | Update appointment                  |
| DELETE | `/appointments/:id`        | Owner/Admin     | Cancel appointment                  |
| PUT    | `/appointments/:id/status` | Admin           | Change appointment status           |

Appointment list query parameters include:

```text
status
doctorId
search
page
limit
```

Create appointment body:

```json
{
  "doctorId": "DOCTOR_ID",
  "date": "YYYY-MM-DD",
  "time": "03:00 PM",
  "reason": "Reason for visit"
}
```

A successful appointment creation returns the created appointment.

If another active appointment occupies the slot, the API returns a conflict response rather than creating a duplicate appointment.

### Patients

| Method | Endpoint                | Authentication | Description                  |
|--------|--------------------------|-----------------|-------------------------------|
| GET    | `/patients`              | Admin           | Search/list patients          |
| PUT    | `/patients/:id/status`   | Admin           | Activate/deactivate patient   |

Patient list query parameters include:

```text
search
page
limit
```

---

## Responsive UI and UX

The frontend is designed to work across:

- Desktop
- Tablet
- Mobile

UI/UX features include:

- Responsive navigation
- Responsive cards and tables
- Consistent forms
- Status badges
- Loading indicators
- Empty states
- Toast notifications
- Confirmation dialogs
- Disabled/loading action buttons
- Doctor image fallback
- 404 page
- Search/filter controls
- Pagination controls
- Appointment details modal

---

## Security Practices

The project implements several basic security practices:

- JWT authentication
- Protected frontend routes
- Protected backend routes
- Role-based authorization
- Password hashing using bcrypt
- Password field excluded from normal user queries
- Backend validation using `express-validator`
- MongoDB/Mongoose schema validation
- CORS configuration
- No database credentials in source-controlled `.env.example`
- Database-level active appointment slot uniqueness

This project is intended as an academic application and should receive additional security hardening before production use.

---

## Testing Checklist

Before submission, test the following flows manually.

### Authentication

- [ ] Register a new patient
- [ ] Reject invalid email
- [ ] Reject invalid password
- [ ] Reject mismatched confirmation password
- [ ] Reject duplicate email
- [ ] Login with valid credentials
- [ ] Reject invalid credentials
- [ ] Logout
- [ ] Access protected page without login
- [ ] Verify admin-only pages cannot be accessed by a patient

### Doctor Catalogue

- [ ] View doctors
- [ ] Search by doctor name
- [ ] Search by specialization
- [ ] Filter by specialization
- [ ] Filter by availability day
- [ ] Sort by name
- [ ] Sort by experience
- [ ] Sort by consultation fee
- [ ] Navigate pagination
- [ ] Open doctor details
- [ ] Verify doctor image/fallback

### Appointment Booking

- [ ] Select an available date
- [ ] Select an available slot
- [ ] Verify unavailable weekday is rejected
- [ ] Verify time outside working hours is rejected
- [ ] Verify past dates are rejected
- [ ] Book an appointment
- [ ] Attempt to book the same active slot again
- [ ] Verify duplicate booking is rejected
- [ ] Verify appointment appears in My Appointments

### Appointment Management

- [ ] View appointment details
- [ ] Search appointments
- [ ] Filter appointments by status
- [ ] Cancel a pending appointment
- [ ] Verify invalid status transitions are rejected
- [ ] Verify admin can approve/reject/complete according to workflow

### Admin

- [ ] Login as admin
- [ ] View dashboard statistics
- [ ] Add doctor
- [ ] Edit doctor
- [ ] Deactivate doctor
- [ ] Reactivate doctor
- [ ] Search patients
- [ ] Activate/deactivate patient
- [ ] View appointments
- [ ] Change appointment status
- [ ] Verify confirmation dialogs
- [ ] Verify loading states

### Responsive Design

- [ ] Desktop layout
- [ ] Tablet layout
- [ ] Mobile navigation
- [ ] Mobile doctor cards
- [ ] Mobile booking form
- [ ] Mobile appointment table/details

---

## Assignment Requirement Coverage

The project is designed around the university's full-stack project requirements.

| Requirement                    | Implementation                                              |
|----------------------------------|--------------------------------------------------------------|
| React.js                       | React 18 + Vite                                              |
| HTML5 / CSS3 / JavaScript      | React frontend and CSS/Tailwind                              |
| React Router                   | React Router v6                                              |
| Axios / Fetch                  | Axios                                                        |
| Node.js                        | Backend runtime                                              |
| Express.js                     | REST API server                                              |
| REST API                       | `/api/auth`, `/api/doctors`, `/api/appointments`, `/api/patients` |
| MongoDB                        | Mongoose + MongoDB                                           |
| JWT Login/Registration         | JWT authentication                                           |
| User Registration              | Patient registration                                         |
| User Login                     | Patient/Admin login                                          |
| Logout                         | Frontend logout                                              |
| Protected Pages                | `ProtectedRoute` + backend middleware                        |
| CRUD                            | Doctor and appointment operations                            |
| Form Validation                | Frontend + `express-validator` + Mongoose                    |
| Search                          | Doctors, patients, appointments                              |
| Filtering                       | Doctor and appointment filters                                |
| Sorting                          | Doctor catalogue                                              |
| REST Integration                | Axios API layer                                              |
| Responsive UI                   | Tailwind responsive layouts                                   |
| Error Handling                  | Centralized backend + frontend toasts                        |
| Loading Indicators              | Shared loader/action loading states                          |
| Success/Error Messages          | Toast notifications                                          |
| Reusable Components             | DoctorCard, DoctorImage, Pagination, Loader, etc.             |
| Folder Structure                | Separated routes/controllers/models/components/pages         |
| No hard-coded database records  | Live database/API values                                     |
| Backend API Validation          | Express-validator + backend business rules                   |
| Documentation                   | This README                                                  |

### Hospital-specific functionality

The hospital assignment requirements are covered by:

- Patient registration
- Patient/Admin login
- JWT authentication
- Protected routes
- Patient dashboard
- Doctor catalogue
- Doctor search
- Specialization filtering
- Availability filtering
- Doctor details
- Appointment booking
- Duplicate booking prevention
- My Appointments
- Admin doctor management
- Admin patient management
- Admin appointment management
- Appointment status management
- MongoDB collections for users, doctors, and appointments

---

## Troubleshooting

### MongoDB connection error

If you see:

```text
MongooseServerSelectionError
```

check:

1. MongoDB is running if using a local database.
2. The Atlas connection string is correct if using MongoDB Atlas.
3. Atlas network access allows your current IP.
4. The database username/password are correct.
5. Special characters in the MongoDB password are URL-encoded.
6. The `.env` file is inside `backend/`.

### Frontend cannot reach backend

Check:

```env
VITE_API_URL=http://localhost:5000/api
```

Then confirm the backend is running:

```text
http://localhost:5000/api/health
```

### CORS error

Check the backend:

```env
CLIENT_URL=http://localhost:5173
```

Make sure the frontend is actually running on the same port.

### Port already in use

If port `5000` is busy, change:

```env
PORT=5001
```

and update:

```env
VITE_API_URL=http://localhost:5001/api
```

Restart both applications after changing environment variables.

### Seed command issues

Run from the backend directory:

```bash
npm run seed
```

Remember that the seed script replaces the existing doctor collection with the six sample doctors.

---

## Production Notes

This repository is intended for an academic full-stack project demonstration.

For a real production deployment, additional work would be recommended, including:

- Strong secret management
- HTTPS
- More restrictive CORS configuration
- Rate limiting
- Security headers
- More comprehensive audit logging
- Production-grade image storage
- Stronger password policy
- Automated tests
- CI/CD
- Production database backups
- Monitoring and alerting

---

## License

This project was created as an academic full-stack project for educational purposes.