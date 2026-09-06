import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import DoctorImage from '../components/DoctorImage';
import { useToast } from '../components/ToastContext';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  // Real slot availability for the chosen date, fetched from the backend —
  // no more hard-coded time list. Reflects each doctor's own hours and
  // excludes whatever is already booked.
  const [slotState, setSlotState] = useState({ loading: false, isAvailableDay: true, slots: [] });

  useEffect(() => {
    api
      .get(`/doctors/${doctorId}`)
      .then((res) => setDoctor(res.data.doctor))
      .catch((err) => showToast(err.response?.data?.message || 'Could not load doctor', 'error'))
      .finally(() => setLoading(false));
  }, [doctorId]);

  useEffect(() => {
    if (!date) {
      setSlotState({ loading: false, isAvailableDay: true, slots: [] });
      return;
    }
    setTime('');
    setSlotState((s) => ({ ...s, loading: true }));
    api
      .get(`/doctors/${doctorId}/slots`, { params: { date } })
      .then((res) => setSlotState({ loading: false, isAvailableDay: res.data.isAvailableDay, slots: res.data.slots }))
      .catch((err) => {
        showToast(err.response?.data?.message || 'Could not load available slots', 'error');
        setSlotState({ loading: false, isAvailableDay: false, slots: [] });
      });
  }, [date, doctorId]);

  if (loading) return <Loader fullScreen />;
  if (!doctor) return <div className="text-center py-20 text-slate-500">Doctor not found.</div>;

  const validate = () => {
    const errs = {};
    if (!date) errs.date = 'Please select a date';
    else if (!slotState.isAvailableDay) errs.date = `Dr. ${doctor.name.replace('Dr. ', '')} is not available on this day`;
    if (!time) errs.time = 'Please select an available time slot';
    if (!reason.trim()) errs.reason = 'Please describe the reason for your visit';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post('/appointments', { doctorId: doctor._id, date, time, reason });
      showToast('Appointment requested successfully! Awaiting confirmation.');
      navigate('/appointments');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not book appointment. Please try another slot.', 'error');
      // Refresh slots in case the failure was a just-booked clash
      if (date) {
        api.get(`/doctors/${doctorId}/slots`, { params: { date } })
          .then((res) => setSlotState({ loading: false, isAvailableDay: res.data.isAvailableDay, slots: res.data.slots }))
          .catch(() => {});
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-brand-600 mb-6 inline-flex items-center gap-1">← Back</button>

      <div className="card p-6 mb-6 flex items-center gap-4">
        <DoctorImage doctor={doctor} className="h-12 w-12 rounded-2xl" />
        <div>
          <p className="font-bold text-slate-800">{doctor.name}</p>
          <p className="text-sm text-brand-600">{doctor.specialization} · ₹{doctor.consultationFee}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-7 space-y-5" noValidate>
        <h2 className="font-bold text-slate-800">Book Your Appointment</h2>

        <div>
          <label className="label">Available days: {doctor.availableDays.join(', ')} &nbsp;·&nbsp; Hours: {doctor.availableTime}</label>
          <label className="label mt-2">Date</label>
          <input
            type="date"
            className="input"
            min={new Date().toISOString().split('T')[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="label">Time slot</label>
          {!date ? (
            <p className="text-sm text-slate-400 italic">Select a date to see available slots.</p>
          ) : slotState.loading ? (
            <p className="text-sm text-slate-400">Checking availability...</p>
          ) : !slotState.isAvailableDay ? (
            <p className="text-sm text-rose-500">The doctor doesn't see patients on this day. Please pick another date.</p>
          ) : slotState.slots.length === 0 ? (
            <p className="text-sm text-slate-400">No slots configured for this doctor.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slotState.slots.map((s) => {
                const isSelected = time === s.time;
                const isBooked = s.status === 'booked';
                return (
                  <button
                    type="button"
                    key={s.time}
                    disabled={isBooked}
                    onClick={() => setTime(s.time)}
                    title={isBooked ? 'Already booked' : 'Available'}
                    className={`text-xs font-semibold py-2 rounded-lg border transition flex flex-col items-center gap-0.5 ${
                      isBooked
                        ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    {s.time}
                    <span className="text-[9px] font-normal normal-case">
                      {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {errors.time && <p className="text-xs text-rose-500 mt-1">{errors.time}</p>}
        </div>

        <div>
          <label className="label">Reason for visit</label>
          <textarea
            className="input min-h-[100px]"
            placeholder="Briefly describe your symptoms or reason for the visit..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {errors.reason && <p className="text-xs text-rose-500 mt-1">{errors.reason}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? '⟳ Booking...' : 'Confirm Appointment Request'}
        </button>
      </form>
    </div>
  );
}
