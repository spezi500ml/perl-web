"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addMinutesToEnd,
  consumePendingMins,
  formatHHMM,
  getPlate,
  getSite,
  setSite,
} from "@/lib/parking";

export const dynamic = "force-dynamic";

export default function SuccessPage() {
  const router = useRouter();

  const [site, setSiteState] = useState("Muster-REWE");
  const [plate, setPlateState] = useState("");
  const [mins, setMins] = useState(0);
  const [newEndMs, setNewEndMs] = useState<number>(0);

  useEffect(() => {
    const s = getSite("Muster-REWE");
    setSite(s);
    setSiteState(s);

    const p = getPlate();
    setPlateState(p);

    const pending = consumePendingMins(); // <-- DAS ist der Schlüssel
    setMins(pending);

    const updated = addMinutesToEnd(pending);
    setNewEndMs(updated);
  }, []);

  const base: React.CSSProperties = useMemo(
    () => ({
      minHeight: "100vh",
      padding: 28,
      background: "#0b0b0b",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      fontSize: 18,
      lineHeight: 1.35,
    }),
    []
  );

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
    marginBottom: 12,
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

  return (
    <main style={base}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: 2, color: "#18c48f" }}>
          PERL
        </div>

        <h1 style={{ fontSize: 34, marginTop: 8, marginBottom: 12 }}>
          Zahlung erfolgreich ✅
        </h1>

        <p style={{ opacity: 0.9, marginBottom: 18 }}>
          Danke! Ihre Verlängerung wurde gebucht.
        </p>

        <div
          style={{
            padding: 18,
            borderRadius: 16,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            marginBottom: 18,
          }}
        >
          <div style={{ opacity: 0.8 }}>Standort</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>{site}</div>

          {plate ? (
            <>
              <div style={{ opacity: 0.8 }}>Kennzeichen</div>
              <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>{plate}</div>
            </>
          ) : null}

          <div style={{ opacity: 0.8 }}>Verlängerung</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>
            +{mins} Minuten
          </div>

          <div style={{ opacity: 0.8 }}>Neues Ende</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>
            {newEndMs ? formatHHMM(newEndMs) : "—"}
          </div>
        </div>

        <button onClick={() => router.push("/extend")} style={btnPrimary}>
          Zurück zur Verlängerung
        </button>

        <button onClick={() => router.push("/")} style={btnSecondary}>
          Zur Startseite
        </button>

        <p style={{ marginTop: 14, opacity: 0.7 }}>
          Hinweis: Sie zahlen nur, wenn Sie aktiv eine Verlängerung auswählen.
        </p>
      </div>
    </main>
  );
}