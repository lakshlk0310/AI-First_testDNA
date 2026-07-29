import React, { useState } from 'react';

export const TestAnalyzer: React.FC = () => {
  const [triggerType, setTriggerType] = useState<'execution' | 'cr_impact'>('execution');
  const [execId, setExecId] = useState('EXEC-2026-88942');

  // CR Impact Inputs
  const [baselineVer, setBaselineVer] = useState('v2.4.1-release');
  const [targetVer, setTargetVer] = useState('v2.5.0-rc2');
  const [diffInput, setDiffInput] = useState(
    'PR #402: Refactored Auth Token Middleware and updated Session Schema. Added SameSite=Strict cookie policy and updated /api/v2/auth/login endpoint response structure.'
  );
  const [crApproval, setCrApproval] = useState<'pending' | 'approved' | 'declined'>('pending');

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Trigger Type Filter Bar */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 24px',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: '220px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Analysis Trigger Mode
          </label>
          <select value={triggerType} onChange={(e) => setTriggerType(e.target.value as any)}>
            <option value="execution">Execution Analysis</option>
            <option value="cr_impact">CR Impact Analysis (Git Diff)</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Execution / Release ID
          </label>
          <input
            type="text"
            value={execId}
            onChange={(e) => setExecId(e.target.value)}
            style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--navy)' }}
          />
        </div>
      </div>

      {/* MODE 1: EXECUTION ANALYSIS */}
      {triggerType === 'execution' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Results Table Card */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="icon-badge-luxury">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>analytics</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Test Case Execution Analysis — {execId}</h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-ok">26 Passed</span>
                <span className="badge badge-navy" style={{ background: '#FFF5F5', color: 'var(--danger)' }}>2 Failed</span>
              </div>
            </div>

            <table className="tbl" style={{ marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th>TC ID</th>
                  <th>Test Case Title</th>
                  <th>Status</th>
                  <th>Failure Cluster Categorization</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ fontFamily: 'monospace', color: 'var(--teal)' }}>TC-GEN-01</strong></td>
                  <td style={{ fontWeight: 600, color: 'var(--navy)' }}>Verify User Authentication & Session Token</td>
                  <td><span className="badge badge-ok">PASSED (142ms)</span></td>
                  <td><span className="tag-item">Authentication</span></td>
                </tr>
                <tr>
                  <td><strong style={{ fontFamily: 'monospace', color: 'var(--teal)' }}>TC-GEN-02</strong></td>
                  <td style={{ fontWeight: 600, color: 'var(--navy)' }}>Validate Invalid Password Rate Limiting</td>
                  <td><span className="badge badge-ok">PASSED (185ms)</span></td>
                  <td><span className="tag-item">Security Policy</span></td>
                </tr>
                <tr>
                  <td><strong style={{ fontFamily: 'monospace', color: 'var(--teal)' }}>TC-GEN-03</strong></td>
                  <td style={{ fontWeight: 600, color: 'var(--navy)' }}>Session Cookie Expiry & Auto Logout SLA</td>
                  <td><span className="badge badge-navy" style={{ background: '#FFF5F5', color: 'var(--danger)' }}>FAILED</span></td>
                  <td><span className="tag-item" style={{ background: '#FEF3C7', color: '#92400E' }}>Response SLA Timeout (&gt;500ms)</span></td>
                </tr>
              </tbody>
            </table>

            {/* Failure Cluster Breakdown */}
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>AI Root Cause Clusters:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', fontSize: '12.5px' }}>
                <strong style={{ color: 'var(--danger)' }}>Cluster 1 (SLA Performance Timeout):</strong> TC-GEN-03 response duration exceeded SLA threshold of 500ms due to database session lookups without index.
              </div>
            </div>
          </div>

          {/* Recommendation Board */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="icon-badge-luxury" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>psychology</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>AI Recommendation Board</h3>
              </div>

              <button
                className="btn-sm btn-teal"
                onClick={() => alert('Bug Stories auto-generated in Jira / Backlog for failed test cases!')}
              >
                + Create Bug Stories in Backlog
              </button>
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#92400E', lineHeight: 1.6 }}>
              <strong>Recommended Engineering Action:</strong> Add MongoDB index on <code>sessions.user_id</code> and update session TTL cookie headers to resolve SLA timeout for TC-GEN-03.
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CR IMPACT ANALYSIS */}
      {triggerType === 'cr_impact' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div className="icon-badge-luxury">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>find_in_page</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>CR Impact Analysis Setup</h3>
            </div>

            <div className="grid-2">
              <div className="field">
                <label>Baseline Version</label>
                <input type="text" value={baselineVer} onChange={(e) => setBaselineVer(e.target.value)} />
              </div>
              <div className="field">
                <label>Target Version</label>
                <input type="text" value={targetVer} onChange={(e) => setTargetVer(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>PR / Change Request Git Diff Notes</label>
              <textarea rows={4} value={diffInput} onChange={(e) => setDiffInput(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '12px' }} />
            </div>

            <button className="btn-sm btn-teal" onClick={() => alert('CR Impact Analysis engine executed.')} style={{ width: '100%', padding: '12px' }}>
              Execute CR Impact Analysis Engine⚡
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>AI Impact Risk Assessment</h3>
              <span className="badge badge-navy" style={{ background: '#FEF3C7', color: '#92400E' }}>Moderate Impact Risk</span>
            </div>

            <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              Analyzed change delta between <code>{baselineVer}</code> → <code>{targetVer}</code>.<br />
              <strong style={{ color: 'var(--teal)' }}>3 Core API Endpoints & 4 Test Cases Impacted</strong> by Auth middleware refactor.
            </div>

            {/* Impact Approval Action Bar */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                className="btn-sm btn-ghost"
                onClick={() => setCrApproval('declined')}
                style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }}
              >
                {crApproval === 'declined' ? '✓ Declined' : 'Decline'}
              </button>
              <button
                className="btn-sm btn-teal"
                onClick={() => setCrApproval('approved')}
                style={{ flex: 1 }}
              >
                {crApproval === 'approved' ? '✓ Approved' : 'Approve & Route to Generator'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
