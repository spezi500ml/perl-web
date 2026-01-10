"use client";
export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ensureParkingInitialized,
  addMinutesToEnd,
  formatClock,
  getEndTs,
} from "@/lib/parking";

const GREEN = "#00B67A";

export default function SuccessPage() {
  const router = useRouter();

  const [plate, setPlate] = useState<string | null>(null);
  const [isE, setIsE] = useState(false);
  const [isH, setIsH] = useState(false);
  const [endClock, setEndClock] = useState("—");

  useEffect(() => {
    // Kennzeichen laden
    setPlate(localStorage.getItem("perl_plate"));
    setIsE(localStorage.getItem("perl_plate_e") === "1");
    setIsH(localStorage.getItem("perl_plate_h") === "1");

    // Grundzustand sicherstellen (90 Min Freiparkzeit)
    ensureParkingInitialized(90);

    // Verlängerung anwenden (kommt aus Extend-Seite)
    const pending = localStorage.getItem("perl_pending_minutes");
    if (pending) {
      const minutes =
        pending === "30" ? 30 : pending === "60" ? 60 : 180;
      addMinutesToEnd(minutes);
      localStorage.removeItem("perl_pending_minutes");
    }

    const end = getEndTs();
    if (end) setEndClock(formatClock(end));
  }, []);

  const plateLabel = useMemo(() => {
    if (!plate) return "—";
    return plate + (isE ? " E" : isH ? " H" : "");
  }, [plate, isE, isH]);

  return (
    <main style={{ padding: 40, maxWidth: 720 }}>
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
            fontWeight: 900,
            opacity: 0.95,
            marginTop: 4,
          }}
        >
          Parkplätze für Kunden
        </div>
      </div>

      <h2>Zahlung erfolgreich ✅</h2>

      <p style={{ opacity: 0.9 }}>
        Danke! Ihre Verlängerung wurde gebucht.
        <br />
        Kennzeichen: <b>{plateLabel}</b>
        <br />
        Neues Ende: <b>{endClock}</b>
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        <button
          onClick={() => router.push("/extend?site=Muster-REWE")}
          style={btn(GREEN)}
        >
          Zurück zur Verlängerung
        </button>

        <button onClick={() => router.push("/")} style={btn()}>
          Zur Startseite
        </button>
      </div>

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.75 }}>
        Hinweis: Sie zahlen nur, wenn Sie aktiv eine Verlängerung auswählen.
      </div>
    </main>
  );
}

const btn = (bg?: string): React.CSSProperties => ({
  padding: 14,
  width: "100%",
  fontSize: 16,
  fontWeight: 900,
  borderRadius: 12,
  background: bg ?? "rgba(255,255,255,0.15)",
  border: "none",
  cursor: "pointer",
});