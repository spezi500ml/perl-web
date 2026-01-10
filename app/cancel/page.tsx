"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CancelInner() {
  const sp = useSearchParams();
  const router = useRouter();

  const site = useMemo(() => sp.get("site") || "Muster-REWE", [sp]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "#0b0b0b",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ fontSize: 34, margin: "0 0 10px" }}>Zahlung abgebrochen</h1>
        <p style={{ opacity: 0.85, marginTop: 0 }}>
          Kein Problem – es wurde nichts berechnet. Sie können jederzeit erneut verlängern.
        </p>

        <div
          style={{
            marginTop: 18,
            padding: 18,
            borderRadius: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.8 }}>Standort</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{site}</div>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          <button
            onClick={() => router.push(`/extend?site=${encodeURIComponent(site)}`)}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "none",
              fontWeight: 800,
              cursor: "pointer",
              background: "#2d2d2d",
              color: "#fff",
            }}
          >
            Zurück zur Verlängerung
          </button>

          <button
            onClick={() => router.push(`/?site=${encodeURIComponent(site)}`)}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
              fontWeight: 800,
              cursor: "pointer",
              background: "transparent",
              color: "#fff",
            }}
          >
            Zur Startseite
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CancelPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            padding: 32,
            background: "#0b0b0b",
            color: "#fff",
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h1 style={{ fontSize: 34, margin: 0 }}>Lade…</h1>
          </div>
        </main>
      }
    >
      <CancelInner />
    </Suspense>
  );
}