"use client";
export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const GREEN = "#00B67A";

export default function ExtendPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const site = sp.get("site") || "Muster-REWE";

  const [plate, setPlate] = useState<string | null>(null);
  const [isE, setIsE] = useState(false);
  const [isH, setIsH] = useState(false);

  useEffect(() => {
    setPlate(localStorage.getItem("perl_plate"));
    setIsE(localStorage.getItem("perl_plate_e") === "1");
    setIsH(localStorage.getItem("perl_plate_h") === "1");
  }, []);

  const plateLabel = useMemo(() => {
    if (!plate) return "—";
    return plate + (isE ? " E" : isH ? " H" : "");
  }, [plate, isE, isH]);

  function goStripe(which: "30" | "60" | "180") {
    if (!plate) {
      router.push(`/?site=${encodeURIComponent(site)}`);
      return;
    }

    // für Success-Seite merken, wie viel verlängert wurde
    localStorage.setItem("perl_pending_minutes", which);

    const link =
      which === "30"
        ? process.env.NEXT_PUBLIC_STRIPE_LINK_30
        : which === "60"
        ? process.env.NEXT_PUBLIC_STRIPE_LINK_60
        : process.env.NEXT_PUBLIC_STRIPE_LINK_180;

    if (!link) {
      alert("Stripe-Link fehlt.");
      return;
    }

    window.location.href = link;
  }

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

      <h2>Parkzeit verlängern</h2>

      <p style={{ opacity: 0.9 }}>
        Standort: <b>{site}</b>
        <br />
        Kennzeichen: <b>{plateLabel}</b>
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <button style={btn(GREEN)} onClick={() => goStripe("30")}>
          +30 Minuten – 0,50 €
        </button>
        <button style={btn(GREEN)} onClick={() => goStripe("60")}>
          +60 Minuten – 1,00 €
        </button>
        <button style={btn(GREEN)} onClick={() => goStripe("180")}>
          +180 Minuten – 5,00 €
        </button>
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        <button
          onClick={() => router.push(`/?site=${encodeURIComponent(site)}`)}
          style={btn()}
        >
          Zurück
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("perl_plate");
            localStorage.removeItem("perl_plate_e");
            localStorage.removeItem("perl_plate_h");
            router.push(`/?site=${encodeURIComponent(site)}`);
          }}
          style={btn()}
        >
          Kennzeichen ändern
        </button>
      </div>

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.75 }}>
        Hinweis: Sie zahlen nur, wenn Sie aktiv eine Verlängerung auswählen.
      </div>
    </main>
  );
}

const btn = (bg?: string): React.CSSProperties => ({
  padding: 16,
  width: "100%",
  fontSize: 16,
  fontWeight: 900,
  borderRadius: 14,
  background: bg ?? "rgba(255,255,255,0.15)",
  border: "none",
  cursor: "pointer",
});