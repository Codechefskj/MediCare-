import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🔍', title: 'Find the right doctor', text: 'Search and filter by specialization, availability, and experience.' },
  { icon: '📅', title: 'Book in seconds', text: 'Pick a date and time slot that works for you — no phone calls needed.' },
  { icon: '📋', title: 'Track everything', text: 'See upcoming, completed, and cancelled appointments in one place.' }
];

export default function Landing() {
  const { user, isAdmin } = useAuth();
  const primaryTo = user ? (isAdmin ? '/admin' : '/dashboard') : '/register';

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-5">
              Hospital Appointment & Patient Management
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Healthcare, <span className="text-brand-600">simplified</span> for every patient.
            </h1>
            <p className="text-slate-500 mt-5 text-lg max-w-lg">
              Find trusted doctors, book appointments instantly, and manage your entire care journey — all from one clean dashboard.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to={primaryTo} className="btn-primary px-6 py-3 text-base">
                {user ? 'Go to Dashboard' : 'Get Started — It’s Free'}
              </Link>
              {!user && <Link to="/login" className="btn-secondary px-6 py-3 text-base">Sign In</Link>}
            </div>
          </div>
          <div className="relative">
            <div className="card p-6 rotate-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500" />
                <div>
                  <p className="font-bold text-slate-800">Dr. Anita Sharma</p>
                  <p className="text-xs text-slate-400">Cardiology · 12 yrs exp</p>
                </div>
                <span className="badge-confirmed ml-auto">Confirmed</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs">Date</p>
                  <p className="font-semibold text-slate-700">12 Sep 2026</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-slate-400 text-xs">Time</p>
                  <p className="font-semibold text-slate-700">11:30 AM</p>
                </div>
              </div>
            </div>
            <div className="card p-4 -rotate-3 absolute -bottom-8 -left-6 w-48 hidden sm:block">
              <p className="text-xs text-slate-400">Total Appointments</p>
              <p className="text-3xl font-extrabold text-brand-600">248+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-extrabold text-center text-slate-800">Everything you need, built in</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
