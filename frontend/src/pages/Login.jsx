import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      showToast(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      const redirectTo = location.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-teal-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">+</div>
          <h1 className="text-2xl font-extrabold text-slate-800">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your appointments</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-4" noValidate>
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-100">
            Demo admin: <span className="font-mono">admin@hospital.com / admin123</span>
          </p>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          New here?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
