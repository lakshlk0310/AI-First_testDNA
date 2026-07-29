import React, { useState } from 'react';
import type { SubProject } from '../../types/project';

interface TestExecutorProps {
  selectedSubProject: SubProject | null;
  onNavigateToAnalyzer: () => void;
}

export const TestExecutor: React.FC<TestExecutorProps> = ({
  selectedSubProject,
  onNavigateToAnalyzer,
}) => {
  const [suite, setSuite] = useState('Full Functional Regression Suite');
  const [environment, setEnvironment] = useState('QA Testing');
  const [selectedBrowsers, setSelectedBrowsers] = useState<string[]>(['Chromium', 'Firefox']);
  const [workers, setWorkers] = useState<number>(4);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '// System Ready.',
    '// Select suite options and click "Execute Functional Tests" to launch run...',
  ]);
  const [stats, setStats] = useState<{ total: number; pass: number; fail: number; time: string } | null>(null);

  const toggleBrowser = (browser: string) => {
    if (selectedBrowsers.includes(browser)) {
      if (selectedBrowsers.length > 1) {
        setSelectedBrowsers(selectedBrowsers.filter((b) => b !== browser));
      }
    } else {
      setSelectedBrowsers([...selectedBrowsers, browser]);
    }
  };

  const handleExecute = () => {
    setIsRunning(true);
    setStats(null);
    setLogs([
      `[${new Date().toLocaleTimeString()}] Initializing test worker pool (${workers} parallel threads)...`,
      `[${new Date().toLocaleTimeString()}] Target Environment: ${environment}`,
      `[${new Date().toLocaleTimeString()}] Browsers Enabled: ${selectedBrowsers.join(', ')}`,
      `[${new Date().toLocaleTimeString()}] Target Workspace: ${selectedSubProject?.name || 'DEWA SmartDNA'}`,
      `[${new Date().toLocaleTimeString()}] Executing test suite: ${suite}...`,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [RUNNER] TC-GEN-01: Verify User Authentication & Session Token -> PASSED (142ms)`,
        `[${new Date().toLocaleTimeString()}] [RUNNER] TC-GEN-02: Validate Invalid Password Rate Limiting -> PASSED (185ms)`,
      ]);
    }, 800);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [RUNNER] TC-GEN-03: Session Cookie Expiry & Auto Logout -> FAILED (SLA Exceeded >500ms)`,
        `[${new Date().toLocaleTimeString()}] Execution completed. Total: 28 | Passed: 26 | Failed: 2 | Duration: 4.8s`,
      ]);
      setStats({ total: 28, pass: 26, fail: 2, time: '4.8s' });
      setIsRunning(false);
    }, 1600);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
        {/* Controls Card */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div className="icon-badge-luxury">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>tune</span>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Execution Controls</h3>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Configure test runner parameters</span>
            </div>
          </div>

          <div className="field">
            <label>Select Test Suite</label>
            <select value={suite} onChange={(e) => setSuite(e.target.value)}>
              <option value="Full Functional Regression Suite">Full Functional Regression Suite</option>
              <option value="Sanity & Smoke Test Suite">Sanity & Smoke Test Suite</option>
              <option value="Auth & Checkout Flow Suite">Auth & Checkout Flow Suite</option>
              <option value="Generated Suite from Test Generator">Generated Suite from Test Generator</option>
            </select>
          </div>

          <div className="field">
            <label>Upload Custom Test Script Files</label>
            <div
              style={{
                border: '1.5px dashed var(--border)',
                borderRadius: '8px',
                padding: '14px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--off)',
                fontSize: '12px',
                color: 'var(--muted)',
              }}
              onClick={() => {
                const sampleFile = `test_spec_${Date.now()}.spec.js`;
                setUploadedFiles([...uploadedFiles, sampleFile]);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--teal)', display: 'block', margin: '0 auto 4px' }}>
                folder_zip
              </span>
              Click to upload test script files (.js, .ts, .py, .feature, .json, .robot)
            </div>
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {uploadedFiles.map((f, i) => (
                  <span key={i} className="tag-item" style={{ fontSize: '11px', color: 'var(--teal)' }}>
                    📄 {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="field">
            <label>Target Environment</label>
            <select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
              <option value="Dev Environment">Dev Environment</option>
              <option value="QA Testing">QA Testing</option>
              <option value="Production Staging">Production Staging</option>
            </select>
          </div>

          <div className="field">
            <label>Browser / Drivers Enabled</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Chromium', 'Firefox', 'WebKit (Safari)'].map((b) => {
                const isActive = selectedBrowsers.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBrowser(b)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isActive ? '1.5px solid var(--teal)' : '1.5px solid var(--border)',
                      background: isActive ? 'rgba(2, 128, 144, 0.1)' : 'white',
                      color: isActive ? 'var(--teal)' : 'var(--muted)',
                    }}
                  >
                    {isActive ? '✓ ' : ''}{b}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label>Parallel Worker Threads ({workers} Workers)</label>
            <input
              type="range"
              min={1}
              max={8}
              value={workers}
              onChange={(e) => setWorkers(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--teal)' }}
            />
          </div>

          <button
            className="btn-sm btn-teal"
            onClick={handleExecute}
            disabled={isRunning}
            style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '12px' }}
          >
            {isRunning ? 'Running Test Suite...' : 'Execute Functional Tests ▶'}
          </button>
        </div>

        {/* Real-Time Terminal Output Console & Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ background: '#0B1740', borderRadius: '16px', padding: '24px', color: 'white', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--mint)' }}>Real-Time Execution Terminal</span>
              {isRunning && <span className="badge badge-ok">Running...</span>}
            </div>

            <div style={{ flex: 1, minHeight: '220px', maxHeight: '280px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '12px', color: '#A7F3D0', lineHeight: 1.6 }}>
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>

          {/* Metrics Card */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>Execution Metrics Summary</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ background: 'var(--off)', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Total</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)' }}>{stats ? stats.total : '—'}</div>
              </div>
              <div style={{ background: '#F0FFF4', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--ok)' }}>Passed</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ok)' }}>{stats ? stats.pass : '—'}</div>
              </div>
              <div style={{ background: '#FFF5F5', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--danger)' }}>Failed</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--danger)' }}>{stats ? stats.fail : '—'}</div>
              </div>
              <div style={{ background: 'var(--off)', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Duration</span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginTop: '4px' }}>{stats ? stats.time : '—'}</div>
              </div>
            </div>

            {stats && (
              <button className="btn-sm btn-ghost" onClick={onNavigateToAnalyzer} style={{ width: '100%', padding: '10px', borderColor: '#7C3AED', color: '#7C3AED', background: '#F5F3FF' }}>
                Analyze Execution Failure Root Causes in AI Test Analyzer →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
