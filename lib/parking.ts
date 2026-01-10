const KEY_ENTRY_TS = "perl_entry_ts"; // Einfahrzeit (Unix ms)
const KEY_END_TS = "perl_end_ts"; // Ende Freiparkzeit (Unix ms)

export const DEFAULT_FREE_MINUTES = 90;

export function nowMs() {
  return Date.now();
}

export function getEntryTs(): number | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(KEY_ENTRY_TS);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function getEndTs(): number | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(KEY_END_TS);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function setEntryTs(entryTs: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_ENTRY_TS, String(entryTs));
}

export function setEndTs(endTs: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_END_TS, String(endTs));
}

export function clearParkingTimes() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_ENTRY_TS);
  localStorage.removeItem(KEY_END_TS);
}

/**
 * MVP-Logik:
 * - Wenn Einfahrzeit oder Endzeit fehlt -> setzen wir beides.
 * - Ende = Einfahrt + freeMinutes (Default 90).
 */
export function ensureParkingInitialized(freeMinutes: number = DEFAULT_FREE_MINUTES) {
  if (typeof window === "undefined") return;

  const entry = getEntryTs();
  const end = getEndTs();

  if (entry && end) return;

  const entryTs = entry ?? nowMs();
  const endTs = entryTs + freeMinutes * 60 * 1000;

  setEntryTs(entryTs);
  setEndTs(endTs);
}

export function getRemainingMs(): number | null {
  const end = getEndTs();
  if (!end) return null;
  return end - nowMs();
}

/**
 * Verlängerung: hängt Minuten an die aktuelle Endzeit an.
 * Wenn Endzeit in der Vergangenheit liegt, hängen wir ab "jetzt" an.
 */
export function addMinutesToEnd(minutes: number) {
  const currentEnd = getEndTs();
  const base = currentEnd && currentEnd > nowMs() ? currentEnd : nowMs();
  const next = base + minutes * 60 * 1000;
  setEndTs(next);
  return next;
}

export function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function formatClock(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
