import { Link } from 'react-router-dom';
import DoctorImage from './DoctorImage';

export default function DoctorCard({ doctor }) {
  return (
    <div className="card p-5 flex flex-col h-full relative">
      {doctor.isActive === false ? (
        <span className="absolute top-4 right-4 badge-cancelled">Inactive</span>
      ) : (
        <span className="absolute top-4 right-4 badge-confirmed">Available</span>
      )}

      <div className="flex items-start gap-4">
        <DoctorImage doctor={doctor} className="h-14 w-14 rounded-2xl" />
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 truncate">{doctor.name}</h3>
          <p className="text-sm text-brand-600 font-medium truncate">{doctor.specialization}</p>
          <p className="text-xs text-slate-400 mt-0.5">⭐ {doctor.experience}+ yrs experience</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3">{doctor.qualification}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {doctor.availableDays?.slice(0, 5).map((d) => (
          <span key={d} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{d}</span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">Consultation</span>
        <span className="font-bold text-slate-800">₹{doctor.consultationFee}</span>
      </div>

      <Link to={`/doctors/${doctor._id}`} className="btn-primary w-full mt-4">
        View Profile
      </Link>
    </div>
  );
}
