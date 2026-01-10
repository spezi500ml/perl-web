"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ensureParkingInitialized,
  getRemainingMs,
  formatRemaining,
  getEntryTs,
  getEndTs,
  formatClock,
  clearParkingTimes,
} from "@/lib/parking";

const GREEN = "#00B67A";
const RED = "#E03131";
const WARN_MS = 10 * 60 * 1000;
const FIXED_SITE = "Muster-REWE";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function toICSDateUTC(ts: number) {
  const d = new Date(ts);
  return (
    d.getUTCFullYear() +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    "Z"
  );
}
function downloadICS(opts: {
  endTs: number;
  remindMinutes: number;
  summary: string;
  description: string;
  location?: string;
}) {
  const { endTs, remindMinutes, summary, description, location } = opts;

  const uid = `perl-${Math.random().toString(16).slice(2)}@perl`;
  const dtstamp = toICSDateUTC(Date.now());
  const dtstart = toICSDateUTC(endTs);
  const dtend = toICSDateUTC(endTs + 60 * 1000);

  const esc = (s: string) =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PERL//Parking Reminder//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `SUMMARY:${esc(summary)}`,
    `DESCRIPTION:${esc(description)}`,
    location ? `LOCATION:${esc(location)}` : undefined,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc("PERL: Freiparkzeit endet bald")}`,
    `TRIGGER:-PT${remindMinutes}M`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean) as string[];

  const content = lines.join("\r\n");
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "PERL_Reminder.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export default function HomePage() {
  const router = useRouter();
  const [site] = useState<string>(FIXED_SITE);

  const [plate, setPlate] = useState<string | null>(null);
  const [isE, setIsE] = useState(false);
  const [isH, setIsH] = useState(false);

  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [entryClock, setEntryClock] = useState("—");
  const [endClock, setEndClock] = useState("—");
  const [endTs, setEndTs] = useState<number | null>(null);

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  // 1) initial: nur Kennzeichen laden, KEIN Timer-Start ohne Registrierung
  useEffect(() => {
    const storedPlate = localStorage.getItem("perl_plate");
    setPlate(storedPlate);

    const storedE = localStorage.getItem("perl_plate_e") === "1";
    const storedH = localStorage.getItem("perl_plate_h") === "1";
    setIsE(storedE && !storedH);
    setIsH(storedH && !storedE);
  }, []);

  // 2) Timer erst starten, wenn Kennzeichen existiert
  useEffect(() => {
    if (!plate) {
      // reset UI
      setRemainingMs(null);
      setEntryClock("—");
      setEndClock("—");
      setEndTs(null);
      return;
    }

    // MVP: Timer-Start ist lokal. Später ersetzt du das durch Arvoo-Entry.
    // Wichtig: Wir initialisieren NUR wenn plate gesetzt ist.
    ensureParkingInitialized(90);

    const tick = () => {
      const entry = getEntryTs();
      const end = getEndTs();
      if (entry) setEntryClock(formatClock(entry));
      if (end) setEndClock(formatClock(end));
      setEndTs(end ?? null);
      setRemainingMs(getRemainingMs());
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [plate]);

  const plateLabel = useMemo(() => {
    if (!plate) return "—";
    const suffix = isE ? " E" : isH ? " H" : "";
    return `${plate}${suffix}`;
  }, [plate, isE, isH]);

  const remainingText = useMemo(() => {
    if (remainingMs === null) return "—";
    return formatRemaining(remainingMs);
  }, [remainingMs]);

  const isWarn = remainingMs !== null && remainingMs <= WARN_MS;
  const isExpired = remainingMs !== null && remainingMs <= 0;
  const timerColor = isExpired ? RED : isWarn ? RED : GREEN;

  function toggleE(checked: boolean) {
    setIsE(checked);
    if (checked) setIsH(false);
  }
  function toggleH(checked: boolean) {
    setIsH(checked);
    if (checked) setIsE(false);
  }

  function savePlate() {
    const a = p1.trim().toUpperCase();
    const b = p2.trim().toUpperCase();

    if (!a || !b) {
      alert("Bitte Kennzeichen vollständig eingeben (z. B. MUC-123).");
      return;
    }
    if (!/^[A-ZÄÖÜ]+$/.test(a)) {
      alert("Der erste Teil darf nur Buchstaben enthalten.");
      return;
    }
    if (!/^[A-Z0-9]+$/.test(b)) {
      alert("Der zweite Teil darf nur Buchstaben und Zahlen enthalten.");
      return;
    }

    const full = `${a}-${b}`;
    localStorage.setItem("perl_plate", full);
    localStorage.setItem("perl_plate_e", isE ? "1" : "0");
    localStorage.setItem("perl_plate_h", isH ? "1" : "0");

    // MVP: wenn User sich registriert, starten wir die Session (später: Arvoo setzt Start)
    clearParkingTimes();

    setPlate(full); // triggert den Timer-Effect
  }

  function changePlate() {
    localStorage.removeItem("perl_plate");
    localStorage.removeItem("perl_plate_e");
    localStorage.removeItem("perl_plate_h");

    setPlate(null);
    setIsE(false);
    setIsH(false);

    // Optional: auch Session resetten
    clearParkingTimes();
  }

  function goExtend() {
    if (!plate) {
      alert("Bitte zuerst Kennzeichen eingeben.");
      return;
    }
    router.push(`/extend?site=${encodeURIComponent(site)}`);
  }

  function addReminder10() {
    if (!endTs) {
      alert("Endzeit fehlt. Bitte Seite neu laden.");
      return;
    }
    const summary = "PERL: Freiparkzeit endet bald";
    const description = `Standort: ${site}\nKennzeichen: ${plateLabel}\nErinnerung: 10 Minuten vor Ende der Freiparkzeit.`;
    downloadICS({
      endTs,
      remindMinutes: 10,
      summary,
      description,
      location: site,
    });
  }

  const canReminder = Boolean(endTs) && !isExpired;

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
      {/* BRAND */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 1,
            color: GREEN,
            lineHeight: 1.1,
          }}
        >
          PERL
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            opacity: 0.95,
            marginTop: 4,
          }}
        >
          Parkplätze für Kunden
        </div>
      </div>

      {/* Wenn nicht registriert: erst Kennzeichen */}
      {!plate ? (
        <>
          <p style={{ opacity: 0.9 }}>
            Bitte erfassen Sie Ihr Kennzeichen einmalig. Danach sehen Sie Ihre
            verbleibende Parkzeit und können bei Bedarf verlängern.
          </p>

          <div
            style={{
              marginTop: 18,
              padding: 18,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 10 }}>
              Kennzeichen einmalig erfassen
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                placeholder="MUC"
                style={inp}
                maxLength={6}
              />
              <span style={{ fontWeight: 900, opacity: 0.8 }}>-</span>
              <input
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                placeholder="123"
                style={inp}
                maxLength={10}
              />
            </div>

            <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
              <label style={checkLabel}>
                <input
                  type="checkbox"
                  checked={isE}
                  onChange={(e) => toggleE(e.target.checked)}
                />
                <span>E-Kennzeichen</span>
              </label>

              <label style={checkLabel}>
                <input
                  type="checkbox"
                  checked={isH}
                  onChange={(e) => toggleH(e.target.checked)}
                />
                <span>H-Kennzeichen</span>
              </label>
            </div>

            <button
              onClick={savePlate}
              style={{
                marginTop: 14,
                padding: 14,
                width: "100%",
                fontWeight: 900,
                background: GREEN,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              Kennzeichen speichern
            </button>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
              Ihr Kennzeichen wird aktuell nur auf diesem Gerät gespeichert.
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
            Standort: <b>{site}</b>
          </div>
        </>
      ) : (
        <>
          <p style={{ opacity: 0.9 }}>
            Sie sehen hier, wie viel Parkzeit noch verbleibt. Wenn Sie länger
            bleiben möchten, können Sie vor Ablauf verlängern.
          </p>

          {/* TIMER CARD (nur wenn registriert) */}
          <div
            style={{
              marginTop: 22,
              padding: 22,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.85 }}>Verbleibende Zeit</div>

            <div
              style={{
                marginTop: 10,
                fontSize: 64,
                fontWeight: 900,
                color: timerColor,
                lineHeight: 1,
              }}
            >
              {remainingText}
            </div>

            <div style={{ marginTop: 12, fontSize: 14 }}>
              Einfahrzeit: <b>{entryClock}</b> • Ende Freiparkzeit:{" "}
              <b>{endClock}</b>
            </div>

            <div style={{ marginTop: 10, fontSize: 14 }}>
              {isExpired
                ? "Freiparkzeit abgelaufen"
                : isWarn
                ? "Weniger als 10 Minuten verbleiben"
                : "Alles im grünen Bereich"}
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <button
                onClick={addReminder10}
                disabled={!canReminder}
                style={{
                  padding: 14,
                  width: "100%",
                  fontWeight: 900,
                  borderRadius: 12,
                  background: canReminder
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.08)",
                  border: "none",
                  cursor: canReminder ? "pointer" : "not-allowed",
                  opacity: canReminder ? 1 : 0.7,
                }}
              >
                Erinnerung setzen (10 Min vorher)
              </button>

              <div style={{ fontSize: 12, opacity: 0.75 }}>
                Öffnet eine Kalender-Erinnerung auf Ihrem Handy (iOS/Android).
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 14 }}>
            Standort: <b>{site}</b>
            <br />
            Kennzeichen: <b>{plateLabel}</b>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
            <button
              onClick={goExtend}
              style={{
                padding: 16,
                width: "100%",
                fontWeight: 900,
                background: GREEN,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              Parkzeit verlängern
            </button>

            <button
              onClick={changePlate}
              style={{
                padding: 12,
                width: "100%",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              Kennzeichen ändern
            </button>
          </div>

          <div style={{ marginTop: 18, fontSize: 12, opacity: 0.75 }}>
            Hinweis: Sie zahlen nur, wenn Sie aktiv eine Verlängerung auswählen.
          </div>
        </>
      )}
    </main>
  );
}

const inp: React.CSSProperties = {
  padding: 12,
  fontSize: 16,
  width: 160,
  marginRight: 6,
  borderRadius: 12,
};

const checkLabel: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  fontSize: 14,
};