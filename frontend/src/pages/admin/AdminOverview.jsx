import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../components/ToastContext';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import DoctorImage from '../../components/DoctorImage';

const todayStr = () => new Date().toISOString().split('T')[0];

export default function AdminOverview() {
  const [totals, setTotals] = useState({ doctors: 0, patients: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([api.get('/doctors?limit=1'), api.get('/appointments?limit=200'), api.get('/patients?limit=1')])
      .then(([d, a, p]) => {
        setTotals({ doctors: d.data.total, patients: p.data.total });
        setAppointments(a.data.appointments);
      })
      .catch((err) => showToast(err.response?.data?.message || 'Could not load overview data', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  const pending = appointments.filter((a) => a.status === 'pending');
  // "Confirmed Today" means status === confirmed AND the appointment date is today —
  // not just any confirmed appointment regardless of date.
  const confirmedToday = appointments.filter((a) => a.status === 'confirmed' && a.date === todayStr());
  const completed = appointments.filter((a) => a.status === 'completed');

  const stats = [
    { label: 'Total Doctors', value: totals.doctors, icon: '🩺', to: '/admin/doctors' },
    { label: 'Total Patients', value: totals.patients, icon: '🧑‍🤝‍🧑', to: '/admin/patients' },
    { label: 'Pending Requests', value: pending.length, icon: '⏳', to: '/admin/appointments' },
    { label: 'Confirmed Today', value: confirmedToday.length, icon: '✅', to: '/admin/appointments' },
    { label: 'Completed (all time)', value: completed.length, icon: '🗂️', to: '/admin/appointments' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Admin Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor and manage the entire hospital appointment system.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card p-5 hover:-translate-y-0.5 transition-transform">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 text-white flex items-center justify-center text-lg mb-3">{s.icon}</div>
            <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6 mb-8">
        <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/doctors" className="btn-primary">+ Add Doctor</Link>
          <Link to="/admin/appointments" className="btn-secondary">View Appointments</Link>
          <Link to="/admin/patients" className="btn-secondary">Manage Patients</Link>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Recent Appointment Requests</h2>
          <Link to="/admin/appointments" className="text-sm text-brand-600 font-semibold hover:underline">Manage all →</Link>
        </div>
        <div className="space-y-3">
          {appointments.slice(0, 6).map((a) => (
            <div key={a._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <DoctorImage doctor={a.doctor} className="h-9 w-9 rounded-lg text-[10px]" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-700 text-sm truncate">{a.patient?.fullName} → {a.doctor?.name}</p>
                  <p className="text-xs text-slate-400">{a.date} at {a.time}</p>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
