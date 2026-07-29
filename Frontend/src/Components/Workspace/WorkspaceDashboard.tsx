import React from 'react';
import type { Project, SubProject } from '../../types/project';

interface WorkspaceDashboardProps {
  selectedProject: Project | null;
  selectedSubProject: SubProject;
  onSwitchWorkspace: () => void;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  selectedProject,
  selectedSubProject,
  onSwitchWorkspace,
}) => {
  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Workspace Header Banner */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          border: '1.5px solid var(--border)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(2, 128, 144, 0.15) 0%, rgba(2, 195, 154, 0.1) 100%)',
                border: '1px solid rgba(2, 128, 144, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--teal)' }}>
                {selectedSubProject.icon || 'layers'}
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="badge badge-navy">
                  {selectedProject?.name || 'Main Project'}
                </span>
                <span className="badge badge-ok">
                  Active Workspace
                </span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                {selectedSubProject.name}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-sm btn-teal"
              onClick={() => alert(`Launching automation suite for ${selectedSubProject.name}...`)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>rocket_launch</span>
              Launch Automation Suite
            </button>
            <button className="btn-sm btn-ghost" onClick={onSwitchWorkspace}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>swap_horiz</span>
              Switch Sub-Project
            </button>
          </div>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, margin: 0, maxWidth: '900px' }}>
          {selectedSubProject.desc || 'No workspace description provided.'}
        </p>

        {/* Environment URLs Section */}
        {selectedSubProject.urls && selectedSubProject.urls.length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--teal)' }}>link</span>
              Configured Business Endpoints ({selectedSubProject.urls.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {selectedSubProject.urls.map((u, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--off)',
                    border: '1px solid var(--border)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <strong style={{ color: 'var(--teal)', fontWeight: 700 }}>{u.env || 'ENV'}:</strong>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text)' }}>{u.url}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metrics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Automated Test Suites</span>
            <div className="icon-badge-luxury">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>folder_open</span>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>14</div>
          <div style={{ fontSize: '12px', color: 'var(--ok)', marginTop: '4px', fontWeight: 600 }}>
            ↑ 3 suites added this week
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Total Test Cases</span>
            <div className="icon-badge-luxury">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>fact_check</span>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>184</div>
          <div style={{ fontSize: '12px', color: 'var(--ok)', marginTop: '4px', fontWeight: 600 }}>
            98.2% Pass Rate
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Avg Execution Speed</span>
            <div className="icon-badge-luxury">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>speed</span>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>1.4s</div>
          <div style={{ fontSize: '12px', color: 'var(--teal)', marginTop: '4px', fontWeight: 600 }}>
            Optimized Parallel Run
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>AI Coverage Quality</span>
            <div className="icon-badge-luxury">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>96%</div>
          <div style={{ fontSize: '12px', color: 'var(--ok)', marginTop: '4px', fontWeight: 600 }}>
            DNA Synthetic Validated
          </div>
        </div>
      </div>

      {/* Overview Capabilities Grid */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>
          Workspace Capabilities
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--teal)', fontSize: '22px' }}>auto_awesome</span>
              <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>Functional Test Automation</strong>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
              Generate, execute, and analyze automated test suites for web, mobile, and API interfaces.
            </p>
          </div>

          <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--teal)', fontSize: '22px' }}>psychology</span>
              <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>AI Model Evaluation</strong>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
              Synthetic data creation, ground truth benchmarking, and evaluation execution telemetry.
            </p>
          </div>

          <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--teal)', fontSize: '22px' }}>admin_panel_settings</span>
              <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>Business Testing & UAT</strong>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
              Admin scoring criteria, acceptance testing workflows, and business validation reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
