import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContext';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  dateOfBirth: '',
  gender: 'other',
  address: { line1: '', city: '', state: '', zip: '' }
};

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const setAddressField = (field, value) => setForm((f) => ({ ...f, address: { ...f.address, [field]: value } }));

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match';
    if (!/^\d{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
    if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    else if (new Date(form.dateOfBirth) > new Date()) errs.dateOfBirth = 'Date of birth cannot be in the future';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      const user = await register(payload);
      showToast(`Account created — welcome, ${user.fullName.split(' ')[0]}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-teal-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">+</div>
          <h1 className="text-2xl font-extrabold text-slate-800">Create your patient account</h1>
          <p className="text-slate-500 text-sm mt-1">Book appointments with top doctors in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-4" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" placeholder="Jane Doe" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} />
              {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setField('email', e.target.value)} />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={(e) => setField('password', e.target.value)} />
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input type="password" className="input" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} />
              {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Phone number</label>
              <input className="input" placeholder="9876543210" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="label">Date of birth</label>
              <input type="date" className="input" value={form.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} />
              {errors.dateOfBirth && <p className="text-xs text-rose-500 mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Street address" value={form.address.line1} onChange={(e) => setAddressField('line1', e.target.value)} />
              <input className="input" placeholder="City" value={form.address.city} onChange={(e) => setAddressField('city', e.target.value)} />
              <input className="input" placeholder="State" value={form.address.state} onChange={(e) => setAddressField('state', e.target.value)} />
              <input className="input" placeholder="ZIP / Postal code" value={form.address.zip} onChange={(e) => setAddressField('zip', e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
