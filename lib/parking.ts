// lib/parking.ts
export const LS_SITE = "perl_site";
export const LS_PLATE = "perl_plate";
export const LS_START_AT = "perl_start_at_ms";
export const LS_END_AT = "perl_end_at_ms";
export const LS_PENDING_MINS = "perl_pending_mins";

export const FREE_MINUTES_DEFAULT = 90;

export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, val: string) {
  try {
    localStorage.setItem(key, val);
  } catch {}
}

export function safeDel(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function nowMs() {
  return Date.now();
}

export function ensureSession(site: string, freeMinutes = FREE_MINUTES_DEFAULT) {
  // Wenn es schon eine Session gibt: nix kaputtmachen
  const startRaw = safeGet(LS_START_AT);
  const endRaw = safeGet(LS_END_AT);

  if (startRaw && endRaw) return;

  const start = nowMs();
  const end = start + freeMinutes * 60 * 1000;

  safeSet(LS_SITE, site);
  safeSet(LS_START_AT, String(start));
  safeSet(LS_END_AT, String(end));
}

export function getSite(fallback = "Muster-REWE") {
  return safeGet(LS_SITE) || fallback;
}

export function setSite(site: string) {
  safeSet(LS_SITE, site);
}

export function setPlate(plate: string) {
  safeSet(LS_PLATE, plate);
}

export function getPlate() {
  return safeGet(LS_PLATE) || "";
}

export function clearPlate() {
  safeDel(LS_PLATE);
}

export function getEndMs(): number {
  const v = Number(safeGet(LS_END_AT) || "0");
  return Number.isFinite(v) && v > 0 ? v : 0;
}

export function setEndMs(ms: number) {
  safeSet(LS_END_AT, String(ms));
}

export function setPendingMins(mins: number) {
  safeSet(LS_PENDING_MINS, String(mins));
}

export function consumePendingMins(): number {
  const v = Number(safeGet(LS_PENDING_MINS) || "0");
  safeDel(LS_PENDING_MINS);
  return Number.isFinite(v) ? v : 0;
}

export function addMinutesToEnd(mins: number) {
  const end = getEndMs();
  const base = end > 0 ? end : nowMs();
  const updated = base + Math.max(0, mins) * 60 * 1000;
  setEndMs(updated);
  return updated;
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatHHMM(ms: number) {
  const d = new Date(ms);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function formatCountdown(msLeft: number) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${pad2(m)}:${pad2(sec)}`;
}

export function normalizePrefix(v: string) {
  return v.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);
}

export function normalizeNumber(v: string) {
  return v.replace(/[^0-9]/g, "").slice(0, 4);
}

export function buildPlate(prefix: string, number: string, isE: boolean, isH: boolean) {
  const p = normalizePrefix(prefix);
  const n = normalizeNumber(number);
  const suffix = isE ? " E" : isH ? " H" : "";
  return `${p}-${n}${suffix}`.trim();
}
