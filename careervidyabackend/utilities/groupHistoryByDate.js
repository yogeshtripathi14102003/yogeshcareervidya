// utilities/groupHistoryByDate.js

/**
 * IST date key nikalo — "YYYY-MM-DD" format me.
 * Example: "2026-06-10"
 */
const getISTDateKey = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
};

/**
 * IST formatted string — "10/06/2026, 04:30 PM"
 */
const formatIST = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * followUpHistory ko date-wise (IST) group karo.
 *
 * Output:
 * [
 *   { date: "2026-06-10", count: 3, entries: [
 *       { _id, remark, status, date (UTC), dateIST }
 *   ]},
 *   { date: "2026-06-09", count: 2, entries: [...] }
 * ]
 *
 * - Latest date pehle
 * - Har date ke andar latest entry pehle
 * - Read-only — database me kuch nahi likhta
 */
export const groupHistoryByDate = (history = []) => {
  if (!Array.isArray(history) || history.length === 0) return [];

  const grouped = {};

  history.forEach((entry) => {
    const key = getISTDateKey(entry.date);
    if (!key) return;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      _id: entry._id,
      remark: entry.remark || "",
      status: entry.status || "",
      date: entry.date,               // raw UTC (agar frontend ko chahiye)
      dateIST: formatIST(entry.date), // formatted IST string
    });
  });

  return Object.entries(grouped)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1)) // latest date pehle
    .map(([date, entries]) => ({
      date,                  // "2026-06-10"
      count: entries.length, // us din kitne updates
      entries: entries.sort(
        (a, b) => new Date(b.date) - new Date(a.date) // latest entry pehle
      ),
    }));
};

/**
 * Kisi bhi date ko IST string me convert karo.
 * Frontend me direct use kar sakte ho.
 */
export const toIST = formatIST;