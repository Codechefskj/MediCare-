import { useState } from 'react';

const initials = (name = '') =>
  name.replace('Dr.', '').trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

// Renders the doctor's photo when available and valid; falls back gracefully
// to an initials avatar if no image is set or the image fails to load.
export default function DoctorImage({ doctor, className = 'h-14 w-14 rounded-2xl' }) {
  const [failed, setFailed] = useState(false);

  if (doctor?.image && !failed) {
    return (
      <img
        src={doctor.image}
        alt={doctor.name}
        onError={() => setFailed(true)}
        className={`${className} object-cover shrink-0 bg-slate-100`}
      />
    );
  }

  return (
    <div className={`${className} bg-gradient-to-br from-brand-500 to-teal-500 text-white flex items-center justify-center font-bold shrink-0`}>
      {initials(doctor?.name)}
    </div>
  );
}
