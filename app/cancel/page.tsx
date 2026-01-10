"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CancelPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const site = sp.get("site") || "";

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
    const suffix = isE ? " E" : isH ? " H" : "";
    return `${plate}${suffix}`;
  }, [plate, isE, isH]);

  return (
    <main style={{ padding: 40, maxWidth: 560 }}>
      <h1>Zahlung abgebrochen</h1>

      <p>
        Keine Sorge – es wurde nichts gebucht.
        <br />
        Kennzeichen: <b>{plateLabel}</b>
        <br />
        Standort: <b>{site || "unbekannt"}</b>
      </p>

      <button
        onClick={() => router.push(`/extend?site=${encodeURIComponent(site)}`)}
        style={{ marginTop: 18, padding: 12, width: "100%", fontWeight: 800 }}
      >
        Zurück zur Verlängerung
      </button>

      <button
        onClick={() => router.push(`/?site=${encodeURIComponent(site)}`)}
        style={{ marginTop: 10, padding: 12, width: "100%" }}
      >
        Zur Startseite
      </button>
    </main>
  );
}