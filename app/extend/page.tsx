export const dynamic = "force-dynamic";

type Props = {
  searchParams?: {
    site?: string;
  };
};

export default function ExtendPage({ searchParams }: Props) {
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
        Parkzeit verlängern
      </h1>

      <p style={{ opacity: 0.85, marginBottom: 24 }}>
        Standort: <strong>{site}</strong>
      </p>

      <div style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <a
          href={process.env.NEXT_PUBLIC_STRIPE_LINK_30}
          style={buttonStyle}
        >
          +30 Minuten
        </a>

        <a
          href={process.env.NEXT_PUBLIC_STRIPE_LINK_60}
          style={buttonStyle}
        >
          +60 Minuten
        </a>

        <a
          href={process.env.NEXT_PUBLIC_STRIPE_LINK_180}
          style={buttonStyle}
        >
          +180 Minuten
        </a>
      </div>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 12,
  background: "#2d2dff",
  color: "#fff",
  fontWeight: 700,
  textDecoration: "none",
  textAlign: "center",
};