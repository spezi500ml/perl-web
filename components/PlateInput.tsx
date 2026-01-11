"use client";

import React from "react";

export type Suffix = "" | "E" | "H";

type Props = {
  prefix: string;
  setPrefix: React.Dispatch<React.SetStateAction<string>>;
  rest: string;
  setRest: React.Dispatch<React.SetStateAction<string>>;
  suffix: Suffix;
  setSuffix: React.Dispatch<React.SetStateAction<Suffix>>;
};

function normalizePrefix(v: string) {
  return v.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);
}

function normalizeRest(v: string) {
  // erlaubt: Buchstaben+Zahlen (ohne Sonderzeichen), max 6 Zeichen wie typische Kennzeichen-Restteile
  return v.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
}

export default function PlateInput({
  prefix,
  setPrefix,
  rest,
  setRest,
  suffix,
  setSuffix,
}: Props) {
  const wrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    background: "#fff",
    boxShadow: "0 10px 26px rgba(0,0,0,0.20)",
  };

  // EU-Balken links
  const eu: React.CSSProperties = {
    width: 44,
    height: 54,
    borderRadius: 10,
    background: "#2b37ff",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 900,
    letterSpacing: 0.5,
    userSelect: "none",
  };

  const stars: React.CSSProperties = {
    fontSize: 10,
    lineHeight: 1,
    opacity: 0.95,
    marginBottom: 4,
  };

  const d: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1,
  };

  // Input-Styles (Wemolo-ish)
  const inBase: React.CSSProperties = {
    height: 54,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "#fff",
    color: "#111",
    fontSize: 18,
    fontWeight: 800,
    outline: "none",
    padding: "0 14px",
    textTransform: "uppercase",
  };

  // Feld 1 bewusst kürzer (3 Buchstaben max)
  const prefixStyle: React.CSSProperties = {
    ...inBase,
    width: 92, // kürzer als vorher
    textAlign: "left",
  };

  // Rechtes Feld kürzer (Container + Input)
  const restStyle: React.CSSProperties = {
    ...inBase,
    width: 210, // deutlich kürzer
  };

  // 2 Punkte statt Trennstrich
  const dotsWrap: React.CSSProperties = {
    width: 16,
    height: 54,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const dots: React.CSSProperties = {
    width: 8,
    height: 22,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const dot: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(0,0,0,0.18)",
  };

  const suffixRow: React.CSSProperties = {
    marginTop: 10,
    display: "flex",
    gap: 18,
    justifyContent: "center",
    alignItems: "center",
  };

  const cbLabel: React.CSSProperties = {
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    opacity: 0.95,
  };

  const cb: React.CSSProperties = {
    width: 16,
    height: 16,
  };

  return (
    <div>
      <div style={wrap}>
        <div style={eu}>
          <div style={stars}>•••••••</div>
          <div style={d}>D</div>
        </div>

        <input
          value={prefix}
          onChange={(e) => setPrefix(normalizePrefix(e.target.value))}
          placeholder="MUC"
          maxLength={3}
          inputMode="text"
          autoCapitalize="characters"
          style={prefixStyle}
        />

        <div style={dotsWrap} aria-hidden="true">
          <div style={dots}>
            <div style={dot} />
            <div style={dot} />
          </div>
        </div>

        <input
          value={rest}
          onChange={(e) => setRest(normalizeRest(e.target.value))}
          placeholder="PD1234"
          maxLength={6}
          inputMode="text"
          autoCapitalize="characters"
          style={restStyle}
        />
      </div>

      {/* E/H exklusiv, optional */}
      <div style={suffixRow}>
        <label style={cbLabel}>
          <input
            style={cb}
            type="checkbox"
            checked={suffix === "E"}
            onChange={(e) => setSuffix(e.target.checked ? "E" : "")}
          />
          E-Kennzeichen
        </label>

        <label style={cbLabel}>
          <input
            style={cb}
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