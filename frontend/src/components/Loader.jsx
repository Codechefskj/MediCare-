export default function Loader({ fullScreen = false, label = 'Loading...' }) {
  return (
    <div className={fullScreen ? 'flex items-center justify-center min-h-screen' : 'flex items-center justify-center py-16'}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
