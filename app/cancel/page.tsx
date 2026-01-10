"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  const [site, setSite] = useState<string>("");
  const [plate, setPlate] = useState<string | null>(null);
  const [isE, setIsE] = useState(false);
  const [isH, setIsH] = useState(false);

  useEffect(() => {
    // URL params nur im Browser lesen (fix für Vercel Build)
    const sp = new URLSearchParams(window.location.search);
    setSite(sp.get("site") || "Muster-REWE");

    // LocalStorage nur im Browser
    const base = localStorage.getItem("perl_plate");
    setPlate(base);
    setIsE(localStorage.getItem("perl_plate_e") === "1");
    setIsH(localStorage.getItem("perl_plate_h") === "1");
  }, []);

  const plateLabel = useMemo(() => {
    if (!plate) return "—";
    const suffix = isE ? " E" : isH ? " H" : "";
    return `${plate}${suffix}`;
  }, [plate, isE, isH]);

  function goBack() {
    // zurück zur Verlängerung
    router.push(`/extend?site=${encodeURIComponent(site || "Muster-REWE")}`);
  }

  function goHome() {
    // zurück zur Startseite
    router.push(`/?site=${encodeURIComponent(site || "Muster-REWE")}`);
  }

  return (
    <main style={wrap}>
      <div style={card}>
        <h1 style={h1}>Zahlung abgebrochen</h1>
        <p style={p}>
          Kein Stress – es wurde nichts gebucht.
          <br />
          Sie können jederzeit erneut verlängern.
        </p>

        <div style={meta}>
          <div>
            <div style={metaLabel}>Standort</div>
            <div style={metaValue}>{site || "Muster-REWE"}</div>
          </div>
          <div>
            <div style={metaLabel}>Kennzeichen</div>
            <div style={metaValue}>{plateLabel}</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          <button onClick={goBack} style={btnPrimary}>
            Zurück zur Verlängerung
          </button>
          <button onClick={goHome} style={btnSecondary}>
            Zur Startseite
          </button>
        </div>
      </div>
    </main>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 24,
  background: "#0b0b0b",
  color: "#fff",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 780,
  borderRadius: 18,
  padding: 22,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const h1: React.CSSProperties = {
  margin: 0,
  fontSize: 32,
  fontWeight: 900,
  letterSpacing: -0.4,
};

const p: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  opacity: 0.9,
  lineHeight: 1.4,
};

const meta: React.CSSProperties = {
  marginTop: 16,
  display: "grid",
  gap: 12,
};

const metaLabel: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.7,
};

const metaValue: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
};

const btnPrimary: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "#2BBF87",
  color: "#0b0b0b",
  fontWeight: 900,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.10)",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};