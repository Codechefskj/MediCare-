import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import DoctorImage from '../components/DoctorImage';
import { useToast } from '../components/ToastContext';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/doctors/${id}`)
      .then((res) => setDoctor(res.data.doctor))
      .catch((err) => showToast(err.response?.data?.message || 'Could not load doctor profile', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!doctor) return <div className="text-center py-20 text-slate-500">Doctor not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-brand-600 mb-6 inline-flex items-center gap-1">
        ← Back
      </button>

      <div className="card p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <DoctorImage doctor={doctor} className="h-24 w-24 rounded-3xl text-3xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-800">{doctor.name}</h1>
              <span className={doctor.isActive ? 'badge-confirmed' : 'badge-cancelled'}>
                {doctor.isActive ? 'Available' : 'Inactive'}
              </span>
            </div>
            <p className="text-brand-600 font-semibold mt-0.5">{doctor.specialization}</p>
            <p className="text-slate-500 text-sm mt-1">{doctor.qualification}</p>

            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400">Experience</p>
                <p className="font-bold text-slate-700">{doctor.experience} years</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400">Consultation Fee</p>
                <p className="font-bold text-slate-700">₹{doctor.consultationFee}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400">Available Time</p>
                <p className="font-bold text-slate-700">{doctor.availableTime}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-slate-400 mb-2">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {doctor.availableDays.map((d) => (
                  <span key={d} className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700">{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => navigate(`/book/${doctor._id}`)}
            disabled={!doctor.isActive}
            className="btn-primary px-6"
            title={!doctor.isActive ? 'This doctor is currently not accepting bookings' : ''}
          >
            {doctor.isActive ? 'Book Appointment' : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
