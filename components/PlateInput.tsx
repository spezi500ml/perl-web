"use client";

import React from "react";

export type Suffix = "" | "E" | "H";

type Props = {
  prefix: string;
  setPrefix: (v: string) => void;

  rest: string;
  setRest: (v: string) => void;

  suffix: Suffix;
  setSuffix: (v: Suffix) => void;
};

function onlyLettersUpper(v: string) {
  return v.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function lettersAndNumbersUpper(v: string) {
  return v.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
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
    width: "100%",
    display: "flex",
    justifyContent: "center",
  };

  // weißes “Wemolo”-Kennzeichen
  const plate: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    background: "#f3f4f6",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.10)",
    padding: 10,
    gap: 10,
    width: "100%",
    maxWidth: 520,
  };

  // EU-Balken links
  const euBar: React.CSSProperties = {
    width: 44,
    height: 54,
    borderRadius: 10,
    background: "#2f39ff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "8px 0 6px",
    alignItems: "center",
    color: "#fff",
    flexShrink: 0,
  };

  const stars: React.CSSProperties = {
    fontSize: 10,
    lineHeight: 1,
    opacity: 0.9,
    letterSpacing: 1,
  };

  const country: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 0.5,
  };

  const inputsRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
  };

  const inputBase: React.CSSProperties = {
    height: 54,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.20)",
    background: "#ffffff",
    color: "#0b0b0b",
    fontSize: 22,
    fontWeight: 900,
    padding: "0 14px",
    outline: "none",
    textTransform: "uppercase",
  };

  const dash: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 900,
    color: "#1f2937",
    opacity: 0.6,
    padding: "0 2px",
  };

  const suffixRow: React.CSSProperties = {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  };

  const suffixLabel: React.CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 18,
    fontWeight: 800,
    opacity: 0.95,
  };

  return (
    <div>
      <div style={plateWrap}>
        <div style={plate}>
          <div style={euBar} aria-hidden>
            <div style={stars}>••••••</div>
            <div style={country}>D</div>
          </div>

          <div style={inputsRow}>
            {/* Prefix max 3 Buchstaben */}
            <input
              value={prefix}
              onChange={(e) => setPrefix(onlyLettersUpper(e.target.value).slice(0, 3))}
              placeholder="MUC"
              maxLength={3}
              inputMode="text"
              autoCapitalize="characters"
              style={{ ...inputBase, width: 110 }}
            />

            <span style={dash}>-</span>

            {/* Rest: Buchstaben+Zahlen, z.B. UC19 / PD1234 */}
            <input
              value={rest}
              onChange={(e) => setRest(lettersAndNumbersUpper(e.target.value).slice(0, 6))}
              placeholder="PD1234"
              maxLength={6}
              inputMode="text"
              autoCapitalize="characters"
              style={{ ...inputBase, flex: 1 }}
            />
          </div>
        </div>
      </div>

      {/* E/H optional aber exklusiv */}
      <div style={suffixRow}>
        <label style={suffixLabel}>
          <input
            type="checkbox"
            checked={suffix === "E"}
            onChange={(e) => setSuffix(e.target.checked ? "E" : "")}
          />
          E-Kennzeichen
        </label>

        <label style={suffixLabel}>
          <input
            type="checkbox"
            checked={suffix === "H"}
            onChange={(e) => setSuffix(e.target.checked ? "H" : "")}
          />
          H-Kennzeichen
        </label>
      </div>
    </div>
  );
}