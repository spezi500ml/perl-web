"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CancelInner() {
  const sp = useSearchParams();
  const router = useRouter();

  const site = sp.get("site") || "Muster-REWE";

  return (
    <main style={{ padding: 40, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 34, marginBottom: 10 }}>Zahlung abgebrochen</h1>
      <p style={{ opacity: 0.9, marginBottom: 20 }}>
        Kein Stress — es wurde nichts gebucht.
        <br />
        Standort: <b>{site}</b>
      </p>

      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <button
          onClick={() => router.push(`/extend?site=${encodeURIComponent(site)}`)}
          style={btn}
        >
          Zurück zur Verlängerung
        </button>

        <button
          onClick={() => router.push(`/?site=${encodeURIComponent(site)}`)}
          style={{ ...btn, background: "#2b2b2b" }}
        >
          Zur Startseite
        </button>
      </div>
    </main>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Lade…</div>}>
      <CancelInner />
    </Suspense>
  );
}

const btn: React.CSSProperties = {
  padding: 14,
  width: "100%",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#00B67A",
  color: "#0b0b0b",
};