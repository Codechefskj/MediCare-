export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <button
        className="btn-secondary text-sm px-4 py-2"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ← Previous
      </button>
      <span className="text-sm text-slate-500 font-medium">
        Page {page} of {pages}
      </span>
      <button
        className="btn-secondary text-sm px-4 py-2"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
