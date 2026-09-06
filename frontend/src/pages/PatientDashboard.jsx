import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import DoctorCard from '../components/DoctorCard';
import DoctorImage from '../components/DoctorImage';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/appointments?limit=100'), api.get('/doctors?limit=3')])
      .then(([apptRes, docRes]) => {
        setAppointments(apptRes.data.appointments);
        setDoctors(docRes.data.doctors);
        setTotalDoctors(docRes.data.total); // real count from the DB, never hard-coded
      })
      .catch((err) => showToast(err.response?.data?.message || 'Could not load dashboard data', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  const upcoming = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => ['cancelled', 'rejected'].includes(a.status));

  const stats = [
    { label: 'Available Doctors', value: totalDoctors, icon: '🩺', color: 'from-brand-500 to-brand-700' },
    { label: 'Upcoming', value: upcoming.length, icon: '📅', color: 'from-teal-500 to-teal-700' },
    { label: 'Completed', value: completed.length, icon: '✅', color: 'from-emerald-500 to-emerald-700' },
    { label: 'Cancelled', value: cancelled.length, icon: '🚫', color: 'from-slate-400 to-slate-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Welcome back, {user.fullName.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Here's an overview of your healthcare activity.</p>
        </div>
        <Link to="/doctors" className="btn-primary">+ Book New Appointment</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-sm text-brand-600 font-semibold hover:underline">View all</Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="card">
              <EmptyState
                icon="📅"
                title="No upcoming appointments"
                subtitle="Book an appointment with one of our specialists to get started."
                action={<Link to="/doctors" className="btn-primary">Find a Doctor</Link>}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 4).map((a) => (
                <div key={a._id} className="card p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <DoctorImage doctor={a.doctor} className="h-10 w-10 rounded-xl" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{a.doctor?.name}</p>
                      <p className="text-xs text-slate-400">{a.doctor?.specialization} · {a.date} at {a.time}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Available Doctors</h2>
            <Link to="/doctors" className="text-sm text-brand-600 font-semibold hover:underline">See all</Link>
          </div>
          <div className="space-y-4">
            {doctors.slice(0, 2).map((d) => (
              <DoctorCard key={d._id} doctor={d} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
