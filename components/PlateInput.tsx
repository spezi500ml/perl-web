"use client";

import React from "react";

export type Suffix = "" | "E" | "H";

type Props = {
  prefix: string;
  setPrefix: React.Dispatch<React.SetStateAction<string>>;

  rest: string;
  setRest: React.Dispatch<React.SetStateAction<string>>;

  // wichtig: so wie du es aktuell im app/page.tsx übergibst
  suffix: Suffix;
  setSuffix: React.Dispatch<React.SetStateAction<Suffix>>;
};

function normPrefix(v: string) {
  return v.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "").slice(0, 3);
}

function normRest(v: string) {
  // zweites Feld: Buchstaben + Zahlen erlauben (z.B. UC19, AB123, 1A23)
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export default function PlateInput({
  prefix,
  setPrefix,
  rest,
  setRest,
  suffix,
  setSuffix,
}: Props) {
  const plateWrap: React.CSSProperties = {
    width: "fit-content", // <- macht das gesamte Kennzeichen so kurz wie möglich
    margin: "0 auto", // <- zentriert es im Card
    background: "#fff",
    borderRadius: 12,
    padding: 10, // kleiner -> weniger Weißraum rechts
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  };

  const blue: React.CSSProperties = {
    width: 30, // schmaler, nur minimal breiter als das "D"
    height: 46,
    borderRadius: 8,
    background: "#2f3cff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 900,
    fontSize: 16,
    letterSpacing: 0.5,
    userSelect: "none",
    flex: "0 0 auto",
  };

  const inputBase: React.CSSProperties = {
    height: 44,
    borderRadius: 8,
    border: "1px solid #d9d9d9",
    background: "#fff",
    color: "#111",
    fontSize: 18,
    fontWeight: 800,
    padding: "0 12px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
    textTransform: "uppercase",
  };

  const prefixStyle: React.CSSProperties = {
    ...inputBase,
    width: 92, // etwas kürzer
    textAlign: "left",
  };

  const restStyle: React.CSSProperties = {
    ...inputBase,
    width: 170, // deutlich kürzer -> weniger Weißraum rechts
    textAlign: "left",
  };

  const dotsWrap: React.CSSProperties = {
    width: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, // mehr Abstand
    flex: "0 0 auto",
  };

  const dot: React.CSSProperties = {
    width: 8, // doppelt so groß wie vorher (optisch)
    height: 8,
    borderRadius: 999,
    background: "#cfcfcf",
  };

  const checkRow: React.CSSProperties = {
    display: "flex",
    gap: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: 800,
  };

  const checkLabel: React.CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    opacity: 0.95,
  };

  function toggleSuffix(next: Suffix) {
    // exklusiv, aber optional: klickt man dasselbe nochmal, wird's wieder leer
    setSuffix((cur) => (cur === next ? "" : next));
  }

  return (
    <div>
      {/* Kennzeichen: kürzer + zentriert */}
      <div style={plateWrap}>
        {/* Blaues Feld: nur "D", keine Sterne */}
        <div style={blue}>D</div>

        <input
          value={prefix}
          onChange={(e) => setPrefix(normPrefix(e.target.value))}
          placeholder="MUC"
          maxLength={3}
          autoCapitalize="characters"
          inputMode="text"
          style={prefixStyle}
        />

        {/* Doppelpunkte (2 Punkte), jetzt deutlich größer */}
        <div style={dotsWrap} aria-hidden>
          <span style={dot} />
          <span style={dot} />
        </div>

        <input
          value={rest}
          onChange={(e) => setRest(normRest(e.target.value))}
          placeholder="PD1234"
          maxLength={6}
          autoCapitalize="characters"
          inputMode="text"
          style={restStyle}
        />
      </div>

      {/* E/H: exklusiv, aber optional */}
      <div style={checkRow}>
        <label style={checkLabel}>
          <input
            type="checkbox"
            checked={suffix === "E"}
            onChange={() => toggleSuffix("E")}
          />
          E-Kennzeichen
        </label>

        <label style={checkLabel}>
          <input
            type="checkbox"
            checked={suffix === "H"}
            onChange={() => toggleSuffix("H")}
          />
          H-Kennzeichen
        </label>
      </div>
    </div>
  );
}