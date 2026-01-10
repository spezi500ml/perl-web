export const dynamic = "force-dynamic";

type Props = {
  searchParams?: {
    site?: string;
  };
};

export default function CancelPage({ searchParams }: Props) {
  const site = searchParams?.site ?? "Muster-REWE";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "#0b0b0b",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      <h1 style={{ fontSize: 34, marginBottom: 12 }}>
        Zahlung abgebrochen
      </h1>

      <p style={{ opacity: 0.85, marginBottom: 24 }}>
        Keine Sorge – es wurde <strong>nichts berechnet</strong>.
      </p>

      <p style={{ opacity: 0.85 }}>
        Standort: <strong>{site}</strong>
      </p>

      <div style={{ marginTop: 24 }}>
        <a
          href={`/?site=${encodeURIComponent(site)}`}
          style={{
            padding: 14,
            borderRadius: 12,
            background: "#2d2dff",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Zurück zur Verlängerung
        </a>
      </div>
    </main>
  );
}