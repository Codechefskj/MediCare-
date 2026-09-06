import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl font-extrabold text-brand-100">404</p>
      <h1 className="text-xl font-bold text-slate-800 mt-2">Page not found</h1>
      <p className="text-slate-500 mt-1">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
