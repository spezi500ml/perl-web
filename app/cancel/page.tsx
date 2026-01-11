"use client";

import { useRouter } from "next/navigation";
import { getSite } from "@/lib/parking";

export const dynamic = "force-dynamic";

export default function CancelPage() {
  const router = useRouter();
  const site = getSite("Muster-REWE");

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 28,
        background: "#0b0b0b",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        fontSize: 18,
        lineHeight: 1.35,
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ fontSize: 34, fontWeight: 900 }}>Zahlung abgebrochen</h1>
        <p style={{ opacity: 0.85 }}>
          Kein Problem – es wurde nichts berechnet. Sie können jederzeit erneut verlängern.
        </p>

        <div style={{ height: 14 }} />

        <button
          onClick={() => router.push(`/extend`)}
          style={{
            width: "100%",
            height: 58,
            borderRadius: 14,
            border: "none",
            background: "#18c48f",
            color: "#00150f",
            fontSize: 20,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Zurück zur Verlängerung
        </button>

        <div style={{ height: 12 }} />

        <button
          onClick={() => router.push(`/`)}
          style={{
            width: "100%",
            height: 58,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "#7ec7ff",
            fontSize: 20,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Zur Startseite
        </button>

        <p style={{ marginTop: 12, opacity: 0.7 }}>
          Standort: <strong>{site}</strong>
        </p>
      </div>
    </main>
  );
}