import React, { useState } from 'react';
import type { SubProject } from '../../types/project';

interface ApiTestingProps {
  selectedSubProject: SubProject | null;
}

interface ApiStep {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  headers: string;
  body: string;
  expectedStatus: number;
}

export const ApiTesting: React.FC<ApiTestingProps> = ({ selectedSubProject }) => {
  const defaultBase = selectedSubProject?.urls && selectedSubProject.urls.length > 0
    ? selectedSubProject.urls[0].url
    : 'https://app.dewa.gov.ae/stg';

  const [workflowName, setWorkflowName] = useState('User Onboarding & Account Provisioning Chain');
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([
    { key: 'BASE_URL', value: defaultBase },
    { key: 'AUTH_TOKEN', value: 'bearer_token_xyz987' },
  ]);

  const [steps, setSteps] = useState<ApiStep[]>([
    {
      id: 'step-1',
      name: 'Step 1: Authenticate & Obtain Bearer Token',
      method: 'POST',
      endpoint: '{{BASE_URL}}/api/v1/auth/login',
      headers: 'Content-Type: application/json',
      body: '{\n  "username": "admin@promantus.com",\n  "password": "secure_password"\n}',
      expectedStatus: 200,
    },
    {
      id: 'step-2',
      name: 'Step 2: Fetch Account Profile Details',
      method: 'GET',
      endpoint: '{{BASE_URL}}/api/v1/account/profile',
      headers: 'Authorization: Bearer {{AUTH_TOKEN}}',
      body: '',
      expectedStatus: 200,
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);

  const handleAddStep = () => {
    const newStep: ApiStep = {
      id: `step-${steps.length + 1}`,
      name: `Step ${steps.length + 1}: New API Endpoint Step`,
      method: 'GET',
      endpoint: '{{BASE_URL}}/api/v1/resource',
      headers: 'Content-Type: application/json',
      body: '',
      expectedStatus: 200,
    };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleStepChange = (id: string, field: keyof ApiStep, value: any) => {
    setSteps(
      steps.map((s) => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  const handleExecuteChain = () => {
    setIsRunning(true);
    setResponseLog(null);

    setTimeout(() => {
      setIsRunning(false);
      setResponseLog(`[EXECUTOR CHAIN RESULT] — Workflow "${workflowName}"
==================================================
Step 1: POST {{BASE_URL}}/api/v1/auth/login -> 200 OK (112ms)
  Header: Content-Type: application/json
  Response Body: { "token": "bearer_token_xyz987", "status": "active" }

Step 2: GET {{BASE_URL}}/api/v1/account/profile -> 200 OK (84ms)
  Header: Authorization: Bearer bearer_token_xyz987
  Response Body: { "account_id": "ACC-88912", "name": "Admin User", "balance": "0.00" }

==================================================
SUMMARY: All ${steps.length} steps PASSED (Average Latency: 98ms)`);
    }, 900);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Bar */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="icon-badge-luxury">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>api</span>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>API Automation Workflow</h3>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Sequence HTTP requests and pass tokens across steps</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-sm btn-ghost" onClick={() => setShowEnvModal(true)}>
            ⚙ Environment Variables ({envVars.length})
          </button>
          <button className="btn-sm btn-teal" onClick={handleExecuteChain} disabled={isRunning}>
            {isRunning ? 'Running Chain...' : '▶ Execute API Workflow'}
          </button>
        </div>
      </div>

      {/* Workflow Name Input */}
      <div className="field" style={{ marginBottom: '20px' }}>
        <label>Workflow Suite Title</label>
        <input type="text" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} style={{ fontWeight: 700, color: 'var(--navy)' }} />
      </div>

      {/* Steps Sequence Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {steps.map((st, idx) => (
          <div
            key={st.id}
            style={{
              background: 'white',
              borderRadius: '14px',
              border: '1.5px solid var(--border)',
              padding: '20px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--teal)', background: 'rgba(2,128,144,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={st.name}
                  onChange={(e) => handleStepChange(st.id, 'name', e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 700, fontSize: '14.5px', color: 'var(--navy)', width: '100%', padding: '2px 0' }}
                />
              </div>

              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteStep(st.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                  title="Delete Step"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 120px', gap: '10px', marginBottom: '12px' }}>
              <select value={st.method} onChange={(e) => handleStepChange(st.id, 'method', e.target.value)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input
                type="text"
                placeholder="https://api.domain.com/v1/resource"
                value={st.endpoint}
                onChange={(e) => handleStepChange(st.id, 'endpoint', e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />

              <input
                type="number"
                placeholder="200"
                value={st.expectedStatus}
                onChange={(e) => handleStepChange(st.id, 'expectedStatus', Number(e.target.value))}
                style={{ textAlign: 'center', fontWeight: 700 }}
              />
            </div>

            <div className="grid-2">
              <div className="field">
                <label style={{ fontSize: '10.5px' }}>Request Headers</label>
                <textarea rows={2} value={st.headers} onChange={(e) => handleStepChange(st.id, 'headers', e.target.value)} style={{ fontFamily: 'monospace', fontSize: '11.5px' }} />
              </div>
              {st.method !== 'GET' && (
                <div className="field">
                  <label style={{ fontSize: '10.5px' }}>Request JSON Payload Body</label>
                  <textarea rows={2} value={st.body} onChange={(e) => handleStepChange(st.id, 'body', e.target.value)} style={{ fontFamily: 'monospace', fontSize: '11.5px' }} />
                </div>
              )}
            </div>
          </div>
        ))}

        <button className="btn-sm btn-ghost" onClick={handleAddStep} style={{ borderStyle: 'dashed', padding: '12px', fontWeight: 700 }}>
          + Add Workflow Step
        </button>
      </div>

      {/* Response Terminal Box */}
      {responseLog && (
        <div style={{ background: '#0B1740', borderRadius: '16px', padding: '24px', color: '#A7F3D0', fontFamily: 'monospace', fontSize: '12.5px', whiteSpace: 'pre-wrap', lineHeight: 1.6, boxShadow: 'var(--shadow-md)' }}>
          {responseLog}
        </div>
      )}

      {/* Environment Variables Modal */}
      {showEnvModal && (
        <div className="modal-overlay" onClick={() => setShowEnvModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>Environment Variables Manager</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '16px' }}>
              Define variables to use in steps with <code>{"{{KEY}}"}</code> syntax.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {envVars.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={ev.key}
                    onChange={(e) => {
                      const next = [...envVars];
                      next[i].key = e.target.value;
                      setEnvVars(next);
                    }}
                    style={{ width: '140px', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                  <input
                    type="text"
                    value={ev.value}
                    onChange={(e) => {
                      const next = [...envVars];
                      next[i].value = e.target.value;
                      setEnvVars(next);
                    }}
                    style={{ flex: 1, fontFamily: 'monospace' }}
                  />
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-sm btn-teal" onClick={() => setShowEnvModal(false)}>Save & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
