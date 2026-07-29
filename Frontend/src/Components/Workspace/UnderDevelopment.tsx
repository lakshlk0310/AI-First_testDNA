import React from 'react';
import { NAV_SECTIONS } from '../Sidebar/Sidebar';

interface UnderDevelopmentProps {
  routeId: string;
  onGoToDashboard: () => void;
}

export const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ routeId, onGoToDashboard }) => {
  // Find route info from NAV_SECTIONS
  let routeLabel = routeId;
  let routeIcon = 'construction';
  let routeSection = 'Platform Feature';

  for (const sec of NAV_SECTIONS) {
    const found = sec.items.find((i) => i.id === routeId);
    if (found) {
      routeLabel = found.label;
      routeIcon = found.icon;
      routeSection = sec.title;
      break;
    }
  }

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0B1740 0%, #0F2060 50%, #028090 100%)',
          borderRadius: '20px',
          padding: '36px',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-30px',
            bottom: '-30px',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '240px', color: 'white' }}>
            {routeIcon}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--mint)' }}>
              {routeIcon}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--mint)', letterSpacing: '0.8px' }}>
              {routeSection}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '2px 0 0 0', color: 'white' }}>
              {routeLabel}
            </h1>
          </div>

          <div
            style={{
              marginLeft: 'auto',
              background: 'rgba(221, 107, 32, 0.2)',
              border: '1px solid rgba(221, 107, 32, 0.4)',
              color: '#FBD38D',
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>engineering</span>
            Under Active Development
          </div>
        </div>

        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
          The <strong style={{ color: 'white' }}>{routeLabel}</strong> module for this sub-project workspace is currently being engineered according to business specification standards. Core REST services and UI pipelines are in progress.
        </p>
      </div>

      {/* Main Status & Roadmap Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
        {/* Progress Overview Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            border: '1.5px solid var(--border)',
            padding: '28px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div className="icon-badge-luxury">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>timeline</span>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Development Milestones</h3>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Implementation status</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
                ✓
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Phase 1: Architecture & API Design</div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>Data models, FastAPI routes & schema validation completed</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FEF3C7', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
                ⚡
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Phase 2: UI Component Integration</div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>Frontend layout & real-time telemetry wiring in progress</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--off)', color: 'var(--muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Phase 3: Automated Quality Gate Release</div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>Full automated test execution suite deployment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            border: '1.5px solid var(--border)',
            padding: '28px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="icon-badge-luxury">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>rocket_launch</span>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>What's Available Now</h3>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Active business features</span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              You can navigate to the <strong style={{ color: 'var(--navy)' }}>Dashboard</strong> to manage your sub-project details, launch configured environment endpoints, or explore active workspace tools.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-sm btn-teal" onClick={onGoToDashboard}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>dashboard</span>
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
