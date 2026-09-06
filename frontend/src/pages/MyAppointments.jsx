import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import DoctorImage from '../components/DoctorImage';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';
import { useToast } from '../components/ToastContext';
import { useConfirm } from '../components/ConfirmContext';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled / Rejected' }
];

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const load = () => {
    setLoading(true);
    api
      .get('/appointments?limit=100')
      .then((res) => setAppointments(res.data.appointments))
      .catch((err) => showToast(err.response?.data?.message || 'Could not load appointments', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancelAppointment = async (appt) => {
    const ok = await confirm({
      title: 'Cancel this appointment?',
      message: `Your appointment with ${appt.doctor?.name} on ${appt.date} at ${appt.time} will be cancelled.`,
      confirmLabel: 'Cancel Appointment',
      danger: true
    });
    if (!ok) return;

    setCancellingId(appt._id);
    try {
      await api.delete(`/appointments/${appt._id}`);
      showToast('Appointment cancelled.');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not cancel appointment.', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesTab =
      tab === 'all' ||
      (tab === 'cancelled' ? ['cancelled', 'rejected'].includes(a.status) : a.status === tab);
    const matchesSearch =
      !search ||
      a.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.reason?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">My Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">View, track, and manage all your bookings.</p>
        </div>
        <Link to="/doctors" className="btn-primary">+ Book New</Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                tab === t.key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          className="input sm:max-w-xs sm:ml-auto"
          placeholder="Search by doctor or reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon="🗓️" title="No appointments here" subtitle="Try a different tab or book your first appointment." />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Doctor</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Time</th>
                  <th className="text-left px-5 py-3 font-semibold">Reason</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-right px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <DoctorImage doctor={a.doctor} className="h-8 w-8 rounded-lg text-[10px]" />
                        <div>
                          <p className="font-semibold text-slate-800">{a.doctor?.name}</p>
                          <p className="text-xs text-slate-400">{a.doctor?.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{a.date}</td>
                    <td className="px-5 py-4 text-slate-600">{a.time}</td>
                    <td className="px-5 py-4 text-slate-600 max-w-[180px] truncate" title={a.reason}>{a.reason}</td>
                    <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                      <button onClick={() => setViewingId(a._id)} className="btn-secondary text-xs px-3 py-1.5">View</button>
                      {['pending', 'confirmed'].includes(a.status) && (
                        <button
                          onClick={() => cancelAppointment(a)}
                          disabled={cancellingId === a._id}
                          className="btn-danger text-xs px-3 py-1.5"
                        >
                          {cancellingId === a._id ? '⟳ Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewingId && <AppointmentDetailsModal appointmentId={viewingId} onClose={() => setViewingId(null)} />}
    </div>
  );
}
