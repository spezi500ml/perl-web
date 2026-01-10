'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ExtendInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const site = useMemo(
    () => searchParams.get('site') || 'Muster-REWE',
    [searchParams]
  );

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 32,
        background: '#0b0b0b',
        color: '#fff',
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, Arial',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 34, marginBottom: 12 }}>
          Parkzeit verlängern
        </h1>

        <p style={{ opacity: 0.85, marginBottom: 24 }}>
          Standort:
        </p>

        <div
          style={{
            padding: 16,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            marginBottom: 24,
          }}
        >
          <strong>{site}</strong>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <button
            onClick={() => router.push(`/success?site=${encodeURIComponent(site)}`)}
            style={{
              padding: 16,
              borderRadius: 12,
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              background: '#22d3ee',
              color: '#000',
            }}
          >
            Verlängerung abschließen
          </button>

          <button
            onClick={() => router.push(`/cancel?site=${encodeURIComponent(site)}`)}
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ExtendPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32 }}>Lade…</div>}>
      <ExtendInner />
    </Suspense>
  );
}