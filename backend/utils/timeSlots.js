// Shared utility for turning a doctor's "availableTime" range (e.g. "02:00 PM - 08:00 PM")
// into a list of concrete hourly slot strings, and for mapping a date to a weekday code.

const DAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const to24Hour = (timeStr) => {
  const [time, meridian] = timeStr.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridian.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (meridian.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const to12Hour = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const meridian = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${meridian}`;
};

// Generates hourly slot start-times between the range start (inclusive) and
// one hour before the range end (so the last slot's consultation fits before closing).
const generateSlotsFromRange = (rangeStr) => {
  try {
    const [startStr, endStr] = rangeStr.split('-').map((s) => s.trim());
    const startMin = to24Hour(startStr);
    const endMin = to24Hour(endStr);
    const slots = [];
    for (let t = startMin; t < endMin; t += 60) {
      slots.push(to12Hour(t));
    }
    return slots;
  } catch (err) {
    return [];
  }
};

const getDayCode = (dateStr) => {
  // dateStr is 'YYYY-MM-DD'; parse as local date to avoid timezone shifting the day
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return DAY_CODES[date.getDay()];
};

const isDateInPast = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

module.exports = { generateSlotsFromRange, getDayCode, isDateInPast, DAY_CODES };
