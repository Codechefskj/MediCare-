import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import { useToast } from '../../components/ToastContext';
import { useConfirm } from '../../components/ConfirmContext';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [actioningId, setActioningId] = useState(null);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const load = () => {
    setLoading(true);
    api
      .get('/patients', { params: { search, page, limit: 8 } })
      .then((res) => {
        setPatients(res.data.patients);
        setPages(res.data.pages);
      })
      .catch((err) => showToast(err.response?.data?.message || 'Could not load patients', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, page]);

  const toggleStatus = async (patient) => {
    if (patient.isActive) {
      const ok = await confirm({
        title: 'Deactivate this patient?',
        message: `${patient.fullName} will no longer be able to log in or book appointments until reactivated.`,
        confirmLabel: 'Deactivate',
        danger: true
      });
      if (!ok) return;
    }

    setActioningId(patient._id);
    try {
      await api.put(`/patients/${patient._id}/status`, { isActive: !patient.isActive });
      showToast(`Patient ${patient.isActive ? 'deactivated' : 'activated'} successfully`);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update patient status', 'error');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Manage Patients</h1>
        <p className="text-slate-500 text-sm mt-1">View registered patients and manage their account access.</p>
      </div>

      <input className="input max-w-sm mb-6" placeholder="Search by name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? (
        <Loader />
      ) : patients.length === 0 ? (
        <div className="card"><EmptyState icon="🧑‍🤝‍🧑" title="No patients found" subtitle="Registered patients will appear here." /></div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">Patient</th>
                    <th className="text-left px-5 py-3 font-semibold">Contact</th>
                    <th className="text-left px-5 py-3 font-semibold">Appointments</th>
                    <th className="text-left px-5 py-3 font-semibold">Status</th>
                    <th className="text-right px-5 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-semibold text-slate-800">{p.fullName}</td>
                      <td className="px-5 py-4 text-slate-600">
                        <p>{p.email}</p>
                        <p className="text-xs text-slate-400">{p.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{p.appointmentCount}</td>
                      <td className="px-5 py-4">
                        <span className={p.isActive ? 'badge-confirmed' : 'badge-cancelled'}>{p.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => toggleStatus(p)}
                          disabled={actioningId === p._id}
                          className={p.isActive ? 'btn-danger text-xs px-3 py-1.5' : 'btn-secondary text-xs px-3 py-1.5'}
                        >
                          {actioningId === p._id ? '⟳' : p.isActive ? 'Deactivate' : 'Activate'}
                        </button>
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
    </div>
  );
}
