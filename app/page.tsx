"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PlateInput, { Suffix } from "@/components/PlateInput";
import {
  clearPlate,
  ensureSession,
  formatCountdown,
  formatHHMM,
  getEndMs,
  getPlate,
  getSite,
  setPlate as persistPlate,
  setSite as persistSite,
} from "@/lib/parking";

export const dynamic = "force-dynamic";

function buildPlateString(prefix: string, rest: string, suffix: Suffix) {
  const p = prefix.trim().toUpperCase();
  const r = rest.trim().toUpperCase();
  const s = suffix ? ` ${suffix}` : "";
  return `${p}-${r}${s}`;
}

function downloadOrOpenICS(icsText: string) {
  const blob = new Blob([icsText], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "perl-erinnerung.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function makeICS({
  title,
  description,
  startMs,
  endMs,
}: {
  title: string;
  description: string;
  startMs: number;
  endMs: number;
}) {
  const toICSDate = (ms: number) => {
    const d = new Date(ms);
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      "Z"
    );
  };

  const uid = `${Date.now()}@perl-web`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PERL//Parking Reminder//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(Date.now())}`,
    `DTSTART:${toICSDate(startMs)}`,
    `DTEND:${toICSDate(endMs)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT10M",
    "ACTION:DISPLAY",
    "DESCRIPTION:PERL Erinnerung",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function HomePage() {
  const router = useRouter();

  const [site, setSite] = useState("Muster-REWE");

  const [prefix, setPrefix] = useState("M");
  const [rest, setRest] = useState("UC19");
  const [suffix, setSuffix] = useState<Suffix>("");

  const [plateSaved, setPlateSaved] = useState("");
  const [endMs, setEndMs] = useState(0);
  const [now, setNow] = useState(Date.now());

  const base = useMemo(
    () => ({
      minHeight: "100vh",
      padding: 22,
      background: "#0b0b0b",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      fontSize: 18,
      lineHeight: 1.35,
    }),
    []
  );

  useEffect(() => {
    const s = getSite("Muster-REWE");
    setSite(s);

    ensureSession(s);
    setEndMs(getEndMs());

    const existing = getPlate();
    if (existing) setPlateSaved(existing);

    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const msLeft = Math.max(0, endMs - now);

  function onSavePlate() {
    if (!prefix.trim() || !rest.trim()) return;

    const plate = buildPlateString(prefix, rest, suffix);
    persistPlate(plate);
    setPlateSaved(plate);

    persistSite(site);
    ensureSession(site);
    setEndMs(getEndMs());
  }

  function onChangePlate() {
    clearPlate();
    setPlateSaved("");
  }

  function goExtend() {
    router.push("/extend");
  }

  function onSetReminder() {
    if (!endMs) return;

    const startMs = endMs;
    const eventEndMs = endMs + 5 * 60 * 1000;

    const title = "PERL: Parkzeit läuft bald ab";
    const description = `Standort: ${site}\nKennzeichen: ${plateSaved}\nEnde Freiparkzeit: ${formatHHMM(endMs)}`;

    const ics = makeICS({ title, description, startMs, endMs: eventEndMs });
    downloadOrOpenICS(ics);
  }

  const cardStyle: React.CSSProperties = {
    maxWidth: 560,
    margin: "0 auto",
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    height: 58,
    borderRadius: 14,
    border: "none",
    background: "#18c48f",
    color: "#00150f",
    fontSize: 20,
    fontWeight: 900,
    cursor: "pointer",
  };

  const btnSecondary: React.CSSProperties = {
    width: "100%",
    height: 58,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#7ec7ff",
    fontSize: 20,
    fontWeight: 900,
    cursor: "pointer",
  };

  const btnGhost: React.CSSProperties = {
    width: "100%",
    height: 52,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "#cfe9ff",
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
  };

  return (
    <main style={base}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: 2, color: "#18c48f" }}>
          PERL
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, marginTop: 6 }}>Parkplätze für Kunden</div>

        <p style={{ opacity: 0.85, marginTop: 10, fontSize: 18 }}>
          Kennzeichen einmalig erfassen um verbleibende Restparkzeit zu sehen und ggF. zu verlängern.
        </p>
      </div>

      <div style={{ height: 14 }} />

      {!plateSaved ? (
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>
            Kennzeichen eingeben und bezahlen
          </div>

          <PlateInput
            prefix={prefix}
            setPrefix={setPrefix}
            rest={rest}
            setRest={setRest}
            suffix={suffix}
            setSuffix={setSuffix}
          />

          <div style={{ height: 14 }} />

          <button onClick={onSavePlate} style={btnPrimary}>
            Kennzeichen speichern
          </button>

          <p style={{ marginTop: 10, opacity: 0.7 }}>
            Ihr Kennzeichen wird aktuell nur auf diesem Gerät gespeichert.
          </p>

          <p style={{ marginTop: 10, opacity: 0.85 }}>
            Standort: <strong>{site}</strong>
          </p>
        </div>
      ) : (
        <div style={cardStyle}>
          <p style={{ opacity: 0.85, fontSize: 18 }}>
            Sie sehen hier, wie viel Parkzeit noch verbleibt. Wenn Sie länger bleiben möchten, können Sie vor Ablauf verlängern.
          </p>

          <div
            style={{
              marginTop: 12,
              padding: 16,
              borderRadius: 16,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ opacity: 0.8, fontSize: 16 }}>Verbleibende Zeit</div>
            <div style={{ fontSize: 58, fontWeight: 900, color: "#18c48f", marginTop: 6 }}>
              {formatCountdown(msLeft)}
            </div>

            <div style={{ marginTop: 8, opacity: 0.85, fontSize: 18 }}>
              Ende Freiparkzeit: <strong>{formatHHMM(endMs)}</strong>
            </div>

            <div style={{ marginTop: 10, opacity: 0.9, fontSize: 18 }}>
              Standort: <strong>{site}</strong>
              <br />
              Kennzeichen: <strong>{plateSaved}</strong>
            </div>
          </div>

          <div style={{ height: 12 }} />

          <button onClick={onSetReminder} style={btnGhost}>
            Erinnerung setzen (10 Min vorher)
          </button>

          <p style={{ marginTop: 8, opacity: 0.7 }}>
            Öffnet eine Kalender-Erinnerung auf Ihrem Handy (iOS/Android).
          </p>

          <div style={{ height: 10 }} />

          <button onClick={goExtend} style={btnPrimary}>
            Parkzeit verlängern
          </button>

          <div style={{ height: 12 }} />

          <button onClick={onChangePlate} style={btnSecondary}>
            Kennzeichen ändern
          </button>

          <p style={{ marginTop: 10, opacity: 0.7 }}>
            Hinweis: Sie zahlen nur, wenn Sie aktiv eine Verlängerung auswählen.
          </p>
        </div>
      )}
    </main>
  );
}