import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import DoctorImage from '../../components/DoctorImage';
import Pagination from '../../components/Pagination';
import AppointmentDetailsModal from '../../components/AppointmentDetailsModal';
import { useToast } from '../../components/ToastContext';
import { useConfirm } from '../../components/ConfirmContext';

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'rejected', 'completed', 'cancelled'];

// Mirrors the backend's ALLOWED_TRANSITIONS state machine so the UI never
// offers a button for a move the server will reject.
const NEXT_ACTIONS = {
  pending: [
    { to: 'confirmed', label: 'Approve', style: 'btn-secondary' },
    { to: 'rejected', label: 'Reject', style: 'btn-danger', danger: true }
  ],
  confirmed: [
    { to: 'completed', label: 'Mark Completed', style: 'btn-secondary' },
    { to: 'cancelled', label: 'Cancel', style: 'btn-danger', danger: true }
  ],
  completed: [],
  rejected: [],
  cancelled: []
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [actioningId, setActioningId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const load = () => {
    setLoading(true);
    const params = { page, limit: 8 };
    if (status !== 'all') params.status = status;
    if (search) params.search = search;
    api
      .get('/appointments', { params })
      .then((res) => {
        setAppointments(res.data.appointments);
        setPages(res.data.pages);
      })
      .catch((err) => showToast(err.response?.data?.message || 'Could not load appointments', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); }, [status, search]);
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [status, search, page]);

  const updateStatus = async (appt, action) => {
    if (action.danger) {
      const ok = await confirm({
        title: `${action.label} this appointment?`,
        message: `${appt.patient?.fullName}'s appointment with ${appt.doctor?.name} on ${appt.date} at ${appt.time} will be marked as ${action.to}.`,
        confirmLabel: action.label,
        danger: true
      });
      if (!ok) return;
    }

    setActioningId(appt._id);
    try {
      await api.put(`/appointments/${appt._id}/status`, { status: action.to });
      showToast(`Appointment marked as ${action.to}`);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update status', 'error');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Manage Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">Approve, reject, or update the status of patient bookings.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                status === s ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input className="input sm:max-w-xs sm:ml-auto" placeholder="Search patient, doctor, reason..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <Loader />
      ) : appointments.length === 0 ? (
        <div className="card"><EmptyState icon="🗓️" title="No appointments found" subtitle="Try a different filter or search term." /></div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">Patient</th>
                    <th className="text-left px-5 py-3 font-semibold">Doctor</th>
                    <th className="text-left px-5 py-3 font-semibold">Date / Time</th>
                    <th className="text-left px-5 py-3 font-semibold">Status</th>
                    <th className="text-right px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{a.patient?.fullName}</p>
                        <p className="text-xs text-slate-400">{a.patient?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <DoctorImage doctor={a.doctor} className="h-8 w-8 rounded-lg text-[10px]" />
                          <span className="text-slate-600">{a.doctor?.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{a.date} · {a.time}</td>
                      <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                        <button onClick={() => setViewingId(a._id)} className="btn-secondary text-xs px-3 py-1.5">View</button>
                        {NEXT_ACTIONS[a.status].map((action) => (
                          <button
                            key={action.to}
                            onClick={() => updateStatus(a, action)}
                            disabled={actioningId === a._id}
                            className={`${action.style} text-xs px-3 py-1.5`}
                          >
                            {actioningId === a._id ? '⟳' : action.label}
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}

      {viewingId && <AppointmentDetailsModal appointmentId={viewingId} onClose={() => setViewingId(null)} />}
    </div>
  );
}
