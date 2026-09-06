import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from './StatusBadge';
import DoctorImage from './DoctorImage';
import Loader from './Loader';

// Fetches the full appointment record via GET /api/appointments/:id and
// displays it in a modal — demonstrates the single-resource REST endpoint in use.
export default function AppointmentDetailsModal({ appointmentId, onClose }) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/appointments/${appointmentId}`)
      .then((res) => setAppointment(res.data.appointment))
      .catch((err) => setError(err.response?.data?.message || 'Could not load appointment details'))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  return (
    <div className="fixed inset-0 z-[95] bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Appointment Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="p-6">
          {loading ? (
            <Loader />
          ) : error ? (
            <p className="text-sm text-rose-500">{error}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DoctorImage doctor={appointment.doctor} className="h-14 w-14 rounded-2xl" />
                <div>
                  <p className="font-bold text-slate-800">{appointment.doctor?.name}</p>
                  <p className="text-sm text-brand-600">{appointment.doctor?.specialization}</p>
                </div>
                <StatusBadge status={appointment.status} className="ml-auto" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Patient</p>
                  <p className="font-semibold text-slate-700">{appointment.patient?.fullName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Consultation Fee</p>
                  <p className="font-semibold text-slate-700">₹{appointment.doctor?.consultationFee}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="font-semibold text-slate-700">{appointment.date}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Time</p>
                  <p className="font-semibold text-slate-700">{appointment.time}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-sm">
                <p className="text-xs text-slate-400 mb-1">Reason for Visit</p>
                <p className="text-slate-700">{appointment.reason}</p>
              </div>

              <p className="text-xs text-slate-400 text-right">Appointment ID: {appointment._id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
