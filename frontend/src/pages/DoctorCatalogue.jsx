import { useEffect, useState } from 'react';
import api from '../api/axios';
import DoctorCard from '../components/DoctorCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { useToast } from '../components/ToastContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DoctorCatalogue() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [availableDay, setAvailableDay] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    api
      .get('/doctors/meta/specializations')
      .then((res) => setSpecializations(res.data.specializations))
      .catch(() => {}); // non-critical — filters just show fewer options
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, specialization, availableDay, sortBy, order]);

  useEffect(() => {
    setLoading(true);
    const params = { search, specialization, availableDay, sortBy, order, page, limit: 9 };
    const timer = setTimeout(() => {
      api
        .get('/doctors', { params })
        .then((res) => {
          setDoctors(res.data.doctors);
          setPages(res.data.pages);
        })
        .catch((err) => showToast(err.response?.data?.message || 'Could not load doctors', 'error'))
        .finally(() => setLoading(false));
    }, 300); // debounce search
    return () => clearTimeout(timer);
  }, [search, specialization, availableDay, sortBy, order, page]);

  const resetFilters = () => {
    setSearch('');
    setSpecialization('');
    setAvailableDay('');
    setSortBy('name');
    setOrder('asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Find a Doctor</h1>
        <p className="text-slate-500 text-sm mt-1">Search by name or specialization, then filter and sort to find the right fit.</p>
      </div>

      <div className="card p-5 mb-8 grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <label className="label">Search</label>
          <input
            className="input"
            placeholder="Doctor name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Specialization</label>
          <select className="input" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
            <option value="">All</option>
            {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Available on</label>
          <select className="input" value={availableDay} onChange={(e) => setAvailableDay(e.target.value)}>
            <option value="">Any day</option>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Sort by</label>
          <div className="flex gap-2">
            <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="experience">Experience</option>
              <option value="fee">Fee</option>
            </select>
            <button
              type="button"
              className="btn-secondary px-3"
              title="Toggle order"
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            >
              {order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {(search || specialization || availableDay) && (
        <button onClick={resetFilters} className="text-sm text-brand-600 font-semibold hover:underline mb-6">
          Clear filters ✕
        </button>
      )}

      {loading ? (
        <Loader />
      ) : doctors.length === 0 ? (
        <EmptyState icon="🔍" title="No doctors found" subtitle="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((d) => <DoctorCard key={d._id} doctor={d} />)}
          </div>
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
