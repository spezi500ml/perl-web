"use client";

import React from "react";

type Props = {
  prefix: string;
  setPrefix: (v: string) => void;

  rest: string;
  setRest: (v: string) => void;

  isE: boolean;
  setIsE: (v: boolean) => void;

  isH: boolean;
  setIsH: (v: boolean) => void;
};

export default function PlateInput({
  prefix,
  setPrefix,
  rest,
  setRest,
  isE,
  setIsE,
  isH,
  setIsH,
}: Props) {
  const outer: React.CSSProperties = {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    padding: 10,
  };

  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "stretch",
    gap: 10,
  };

  const euBadge: React.CSSProperties = {
    width: 46,
    borderRadius: 12,
    background: "#2f49ff",
    border: "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 900,
    letterSpacing: 1,
    userSelect: "none",
  };

  const euStars: React.CSSProperties = {
    fontSize: 10,
    lineHeight: "10px",
    opacity: 0.9,
    marginBottom: 4,
  };

  const plateShell: React.CSSProperties = {
    flex: 1,
    height: 56,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: 10,
  };

  const inputBase: React.CSSProperties = {
    height: 44,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    color: "#fff",
    fontSize: 22,
    fontWeight: 900,
    padding: "0 12px",
    outline: "none",
    textTransform: "uppercase",
  };

  const dot: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "rgba(255,255,255,0.25)",
  };

  const suffixWrap: React.CSSProperties = {
    display: "flex",
    gap: 18,
    alignItems: "center",
    marginTop: 12,
    fontSize: 18,
    fontWeight: 800,
    opacity: 0.95,
  };

  function normalizePrefix(v: string) {
    return v.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "").slice(0, 3);
  }

  // Rest = Buchstaben + Zahlen (für z.B. UC19)
  function normalizeRest(v: string) {
    return v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  }

  return (
    <div style={outer}>
      <div style={row}>
        <div style={euBadge}>
          <div style={euStars}>••••</div>
          <div style={{ fontSize: 16 }}>D</div>
        </div>

        <div style={plateShell}>
          {/* Feld 1: max 3 Buchstaben */}
          <input
            value={prefix}
            onChange={(e) => setPrefix(normalizePrefix(e.target.value))}
            placeholder="MUC"
            maxLength={3}
            inputMode="text"
            autoCapitalize="characters"
            style={{ ...inputBase, width: 88, textAlign: "center" }}
          />

          {/* „Nieten“-Punkte */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={dot} />
            <div style={dot} />
          </div>

          {/* Feld 2: Buchstaben + Zahlen */}
          <input
            value={rest}
            onChange={(e) => setRest(normalizeRest(e.target.value))}
            placeholder="UC19"
            maxLength={6}
            inputMode="text"
            autoCapitalize="characters"
            style={{ ...inputBase, flex: 1, minWidth: 120 }}
          />
        </div>
      </div>

      {/* E/H: optional & exklusiv (kann auch keins gewählt werden) */}
      <div style={suffixWrap}>
        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isE}
            onChange={(e) => {
              const next = e.target.checked;
              setIsE(next);
              if (next) setIsH(false);
            }}
          />
          E-Kennzeichen
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isH}
            onChange={(e) => {
              const next = e.target.checked;
              setIsH(next);
              if (next) setIsE(false);
            }}
          />
          H-Kennzeichen
        </label>
      </div>
    </div>
  );
}