"use client";

import React from "react";

type Props = {
  prefix: string;
  number: string;
  isE: boolean;
  isH: boolean;
  onPrefixChange: (v: string) => void;
  onNumberChange: (v: string) => void;
  onToggleE: (next: boolean) => void;
  onToggleH: (next: boolean) => void;
};

export default function PlateInput({
  prefix,
  number,
  isE,
  isH,
  onPrefixChange,
  onNumberChange,
  onToggleE,
  onToggleH,
}: Props) {
  const wrap: React.CSSProperties = {
    width: "100%",
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  };

  const plateRow: React.CSSProperties = {
    display: "flex",
    alignItems: "stretch",
    gap: 12,
    justifyContent: "center",
  };

  const plateOuter: React.CSSProperties = {
    display: "flex",
    alignItems: "stretch",
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.2) inset",
  };

  const euStripe: React.CSSProperties = {
    width: 44,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#2340ff",
    color: "#fff",
    fontWeight: 900,
    letterSpacing: 0.5,
    userSelect: "none",
  };

  const stars: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 4px)",
    gap: 2,
    opacity: 0.9,
    marginBottom: 6,
  };

  const starDot: React.CSSProperties = {
    width: 4,
    height: 4,
    borderRadius: 999,
    background: "rgba(255,255,255,0.9)",
  };

  const fieldBase: React.CSSProperties = {
    height: 58,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#fff",
    fontSize: 24,
    fontWeight: 900,
    padding: "0 14px",
    textTransform: "uppercase",
  };

  const prefixStyle: React.CSSProperties = {
    ...fieldBase,
    width: 96,
    textAlign: "center",
    borderRight: "1px solid rgba(255,255,255,0.12)",
  };

  const numberWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 160,
    paddingRight: 8,
  };

  const numberStyle: React.CSSProperties = {
    ...fieldBase,
    flex: 1,
    minWidth: 0,
    textAlign: "left",
  };

  const rightCap: React.CSSProperties = {
    width: 18,
    marginLeft: 8,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
  };

  // Checkbox style (größer + klickbar)
  const cbRow: React.CSSProperties = {
    display: "flex",
    gap: 18,
    marginTop: 14,
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const cbLabel: React.CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 18,
    fontWeight: 800,
    userSelect: "none",
    cursor: "pointer",
  };

  const cb: React.CSSProperties = {
    width: 20,
    height: 20,
    accentColor: "#18c48f",
  };

  return (
    <div style={wrap}>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>
        Kennzeichen einmalig erfassen
      </div>

      <div style={plateRow}>
        <div style={plateOuter}>
          <div style={euStripe}>
            <div style={stars} aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={starDot} />
              ))}
            </div>
            <div style={{ fontSize: 16, lineHeight: 1 }}>D</div>
          </div>

          <input
            value={prefix}
            onChange={(e) => onPrefixChange(e.target.value.toUpperCase())}
            placeholder="MUC"
            maxLength={3}
            inputMode="text"
            autoCapitalize="characters"
            style={prefixStyle}
          />

          <div style={numberWrap}>
            <input
              value={number}
              onChange={(e) => onNumberChange(e.target.value)}
              placeholder="123"
              maxLength={4}
              inputMode="numeric"
              style={numberStyle}
            />
            <div style={rightCap} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Checkboxen: nur eins gleichzeitig, aber auch keins möglich */}
      <div style={cbRow}>
        <label style={cbLabel}>
          <input
            type="checkbox"
            checked={isE}
            onChange={(e) => onToggleE(e.target.checked)}
            style={cb}
          />
          E-Kennzeichen
        </label>

        <label style={cbLabel}>
          <input
            type="checkbox"
            checked={isH}
            onChange={(e) => onToggleH(e.target.checked)}
            style={cb}
          />
          H-Kennzeichen
        </label>
      </div>

      <p style={{ marginTop: 10, opacity: 0.7, fontSize: 16 }}>
        Ihr Kennzeichen wird aktuell nur auf diesem Gerät gespeichert.
      </p>
    </div>
  );
}