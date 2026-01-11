"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PlateInput from "@/components/PlateInput";
import {
  buildPlate,
  clearPlate,
  ensureSession,
  formatCountdown,
  formatHHMM,
  getEndMs,
  getPlate,
  getSite,
  normalizeNumber,
  normalizePrefix,
  setPlate,
  setSite,
} from "@/lib/parking";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const router = useRouter();

  const [site, setSiteState] = useState("Muster-REWE");

  const [prefix, setPrefix] = useState("MUC");
  const [number, setNumber] = useState("321");
  const [isE, setIsE] = useState(false);
  const [isH, setIsH] = useState(false);

  const [plateSaved, setPlateSaved] = useState("");
  const [endMs, setEndMsState] = useState(0);
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
    setSiteState(s);
    ensureSession(s);
    setEndMsState(getEndMs());

    const p = getPlate();
    if (p) setPlateSaved(p);

    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const msLeft = Math.max(0, endMs - now);

  function onSavePlate() {
    const plate = buildPlate(prefix, number, isE, isH);
    setPlate(plate);
    setPlateSaved(plate);

    setSite(site);
    ensureSession(site);
    setEndMsState(getEndMs());
  }

  function onChangePlate() {
    clearPlate();
    setPlateSaved("");
    // Optional: Wenn du willst, dass beim Ändern wieder “keins” default ist:
    setIsE(false);
    setIsH(false);
  }

  function goExtend() {
    router.push(`/extend`);
  }

  // Mutual-Exclusion: E und H nie gleichzeitig, aber beides darf aus sein
  function toggleE(next: boolean) {
    if (next) {
      setIsE(true);
      setIsH(false);
    } else {
      setIsE(false);
    }
  }

  function toggleH(next: boolean) {
    if (next) {
      setIsH(true);
      setIsE(false);
    } else {
      setIsH(false);
    }
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

  return (
    <main style={base}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: 2, color: "#18c48f" }}>
          PERL
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, marginTop: 6 }}>
          Parkplätze für Kunden
        </div>
        <p style={{ opacity: 0.85, marginTop: 10, fontSize: 18 }}>
          Bitte erfassen Sie Ihr Kennzeichen einmalig. Danach sehen Sie Ihre verbleibende Parkzeit und können bei Bedarf verlängern.
        </p>
      </div>

      <div style={{ height: 14 }} />

      {!plateSaved ? (
        <div style={cardStyle}>
          <PlateInput
            prefix={prefix}
            number={number}
            isE={isE}
            isH={isH}
            onPrefixChange={(v) => setPrefix(normalizePrefix(v))}
            onNumberChange={(v) => setNumber(normalizeNumber(v))}
            onToggleE={toggleE}
            onToggleH={toggleH}
          />

          <button onClick={onSavePlate} style={{ ...btnPrimary, marginTop: 12 }}>
            Kennzeichen speichern
          </button>

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

          <div style={{ height: 14 }} />

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