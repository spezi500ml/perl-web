"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSite, setPendingMins } from "@/lib/parking";

export const dynamic = "force-dynamic";

export default function ExtendPage() {
  const router = useRouter();
  const site = useMemo(() => getSite("Muster-REWE"), []);

  const link30 = process.env.NEXT_PUBLIC_STRIPE_LINK_30 || "";
  const link60 = process.env.NEXT_PUBLIC_STRIPE_LINK_60 || "";
  const link180 = process.env.NEXT_PUBLIC_STRIPE_LINK_180 || "";

  function go(mins: number, url: string) {
    if (!url) {
      alert("Stripe-Link fehlt in den Environment Variables.");
      return;
    }
    setPendingMins(mins);
    // harter Redirect zu Stripe
    window.location.href = url;
  }

  const base: React.CSSProperties = {
    minHeight: "100vh",
    padding: 28,
    background: "#0b0b0b",
    color: "#fff",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    fontSize: 18,
    lineHeight: 1.35,
  };

  const btn: React.CSSProperties = {
    width: "100%",
    height: 68,
    borderRadius: 16,
    border: "none",
    background: "#2a2bff",
    color: "#fff",
    fontSize: 24,
    fontWeight: 900,
    cursor: "pointer",
  };

  return (
    <main style={base}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8 }}>Parkzeit verlängern</h1>
        <div style={{ opacity: 0.85, fontSize: 20, marginBottom: 18 }}>
          Standort: <strong>{site}</strong>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <button onClick={() => go(30, link30)} style={btn}>
            +30 Minuten
          </button>
          <button onClick={() => go(60, link60)} style={btn}>
            +60 Minuten
          </button>
          <button onClick={() => go(180, link180)} style={btn}>
            +180 Minuten
          </button>
        </div>

        <div style={{ height: 18 }} />

        <button
          onClick={() => router.push("/")}
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
          Zurück
        </button>
      </div>
    </main>
  );
}