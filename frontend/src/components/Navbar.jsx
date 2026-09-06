import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
    }`;

  const patientLinks = (
    <>
      <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/doctors" className={linkClass}>Find Doctors</NavLink>
      <NavLink to="/appointments" className={linkClass}>My Appointments</NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink to="/admin" className={linkClass} end>Overview</NavLink>
      <NavLink to="/admin/doctors" className={linkClass}>Doctors</NavLink>
      <NavLink to="/admin/appointments" className={linkClass}>Appointments</NavLink>
      <NavLink to="/admin/patients" className={linkClass}>Patients</NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? (isAdmin ? '/admin' : '/dashboard') : '/'} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">+</div>
            <span className="font-extrabold text-lg text-slate-800 tracking-tight">MediCare<span className="text-brand-600">+</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {user && (isAdmin ? adminLinks : patientLinks)}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right leading-tight">
                  <p className="text-sm font-semibold text-slate-700">{user.fullName}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="btn-ghost">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-1">
          {user ? (
            <>
              {isAdmin ? adminLinks : patientLinks}
              <button onClick={handleLogout} className="btn-ghost w-full justify-start mt-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-lg text-slate-600" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="block px-3 py-2 rounded-lg text-brand-700 font-semibold" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
