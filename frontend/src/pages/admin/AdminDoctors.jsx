import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import DoctorImage from '../../components/DoctorImage';
import Pagination from '../../components/Pagination';
import { useToast } from '../../components/ToastContext';
import { useConfirm } from '../../components/ConfirmContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const emptyForm = {
  name: '', specialization: '', experience: '', qualification: '',
  availableDays: [], availableTime: '09:00 AM - 05:00 PM', consultationFee: '', image: ''
};

function DoctorModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const isEdit = Boolean(initial?._id);

  const toggleDay = (day) =>
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day) ? f.availableDays.filter((d) => d !== day) : [...f.availableDays, day]
    }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.specialization.trim()) errs.specialization = 'Required';
    if (form.experience === '' || form.experience < 0) errs.experience = 'Enter valid years';
    if (!form.qualification.trim()) errs.qualification = 'Required';
    if (form.consultationFee === '' || form.consultationFee < 0) errs.consultationFee = 'Enter valid fee';
    if (form.availableDays.length === 0) errs.availableDays = 'Select at least one day';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, experience: Number(form.experience), consultationFee: Number(form.consultationFee) };
      if (isEdit) {
        await api.put(`/doctors/${initial._id}`, payload);
        showToast('Doctor updated successfully');
      } else {
        await api.post('/doctors', payload);
        showToast('Doctor added successfully');
      }
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save doctor', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{isEdit ? 'Edit Doctor' : 'Add New Doctor'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <DoctorImage doctor={form} className="h-12 w-12 rounded-xl" />
            <div className="flex-1">
              <label className="label">Image URL (optional)</label>
              <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. John Doe" />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Specialization</label>
              <input className="input" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
              {errors.specialization && <p className="text-xs text-rose-500 mt-1">{errors.specialization}</p>}
            </div>
            <div>
              <label className="label">Experience (yrs)</label>
              <input type="number" min="0" className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              {errors.experience && <p className="text-xs text-rose-500 mt-1">{errors.experience}</p>}
            </div>
          </div>
          <div>
            <label className="label">Qualification</label>
            <input className="input" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="MBBS, MD" />
            {errors.qualification && <p className="text-xs text-rose-500 mt-1">{errors.qualification}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Available Time</label>
              <input className="input" value={form.availableTime} onChange={(e) => setForm({ ...form, availableTime: e.target.value })} placeholder="09:00 AM - 05:00 PM" />
            </div>
            <div>
              <label className="label">Consultation Fee (₹)</label>
              <input type="number" min="0" className="input" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} />
              {errors.consultationFee && <p className="text-xs text-rose-500 mt-1">{errors.consultationFee}</p>}
            </div>
          </div>
          <div>
            <label className="label">Available Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                    form.availableDays.includes(d) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            {errors.availableDays && <p className="text-xs text-rose-500 mt-1">{errors.availableDays}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? '⟳ Saving...' : isEdit ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modal, setModal] = useState(null); // null | {} (add) | doctor (edit)
  const [actioningId, setActioningId] = useState(null);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const load = () => {
    setLoading(true);
    api
      .get('/doctors', { params: { search, page, limit: 8, includeInactive: true } })
      .then((res) => {
        setDoctors(res.data.doctors);
        setPages(res.data.pages);
      })
      .catch((err) => showToast(err.response?.data?.message || 'Could not load doctors', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, page]);

  const handleDelete = async (doctor) => {
    const ok = await confirm({
      title: 'Delete Doctor?',
      message: `Are you sure you want to remove ${doctor.name}? If they have appointment history, they'll be deactivated instead of deleted.`,
      confirmLabel: 'Delete Doctor',
      danger: true
    });
    if (!ok) return;

    setActioningId(doctor._id);
    try {
      const res = await api.delete(`/doctors/${doctor._id}`);
      showToast(res.data.message);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete doctor', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const handleReactivate = async (doctor) => {
    setActioningId(doctor._id);
    try {
      await api.put(`/doctors/${doctor._id}/status`, { isActive: true });
      showToast('Doctor reactivated');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not reactivate doctor', 'error');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Manage Doctors</h1>
          <p className="text-slate-500 text-sm mt-1">Add, edit, or remove doctors from the system.</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary">+ Add Doctor</button>
      </div>

      <input className="input max-w-sm mb-6" placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? (
        <Loader />
      ) : doctors.length === 0 ? (
        <div className="card"><EmptyState icon="🩺" title="No doctors yet" subtitle="Add your first doctor to get started." /></div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">Doctor</th>
                    <th className="text-left px-5 py-3 font-semibold">Specialization</th>
                    <th className="text-left px-5 py-3 font-semibold">Experience</th>
                    <th className="text-left px-5 py-3 font-semibold">Fee</th>
                    <th className="text-left px-5 py-3 font-semibold">Status</th>
                    <th className="text-right px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <DoctorImage doctor={d} className="h-9 w-9 rounded-lg text-[10px]" />
                          <span className="font-semibold text-slate-800">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{d.specialization}</td>
                      <td className="px-5 py-4 text-slate-600">{d.experience} yrs</td>
                      <td className="px-5 py-4 text-slate-600">₹{d.consultationFee}</td>
                      <td className="px-5 py-4">
                        <span className={d.isActive ? 'badge-confirmed' : 'badge-cancelled'}>{d.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                        <button onClick={() => setModal(d)} className="btn-secondary text-xs px-3 py-1.5">Edit</button>
                        {d.isActive ? (
                          <button onClick={() => handleDelete(d)} disabled={actioningId === d._id} className="btn-danger text-xs px-3 py-1.5">
                            {actioningId === d._id ? '⟳' : 'Delete'}
                          </button>
                        ) : (
                          <button onClick={() => handleReactivate(d)} disabled={actioningId === d._id} className="btn-secondary text-xs px-3 py-1.5">
                            {actioningId === d._id ? '⟳' : 'Reactivate'}
                          </button>
                        )}
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

      {modal !== null && (
        <DoctorModal initial={modal._id ? modal : { ...emptyForm }} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />
      )}
    </div>
  );
}
