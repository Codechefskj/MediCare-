const LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export default function StatusBadge({ status, className = '' }) {
  return <span className={`badge-${status} ${className}`}>{LABELS[status] || status}</span>;
}
