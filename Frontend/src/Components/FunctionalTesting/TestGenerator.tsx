import React, { useState } from 'react';
import type { SubProject } from '../../types/project';

interface TestGeneratorProps {
  selectedSubProject: SubProject | null;
  onNavigateToExecutor: () => void;
}

export const TestGenerator: React.FC<TestGeneratorProps> = ({
  selectedSubProject,
  onNavigateToExecutor,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [reqText, setReqText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedRequirements, setParsedRequirements] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Generated Test Cases State
  const [testCases, setTestCases] = useState<
    { id: string; title: string; category: string; type: string; priority: string }[]
  >([
    { id: 'TC-GEN-01', title: 'Verify User Authentication & OAuth Token Issuance', category: 'Functional', type: 'Positive', priority: 'High' },
    { id: 'TC-GEN-02', title: 'Validate Invalid Password Rate Limiting (HTTP 429)', category: 'Security', type: 'Negative', priority: 'High' },
    { id: 'TC-GEN-03', title: 'Verify Session Cookie Expiry & Auto Logout SLA', category: 'Integration', type: 'Boundary', priority: 'Medium' },
  ]);

  // Script Generator State
  const [targetFramework, setTargetFramework] = useState('js');
  const [targetUrl, setTargetUrl] = useState(
    selectedSubProject?.urls && selectedSubProject.urls.length > 0
      ? selectedSubProject.urls[0].url
      : 'https://app.dewa.gov.ae/stg'
  );
  const [assertions, setAssertions] = useState({
    statusCode: true,
    domVisibility: true,
    jsonSchema: true,
    performanceSla: true,
    nonNullPayload: false,
    authTokenCheck: true,
  });
  const [generatedCode, setGeneratedCode] = useState(
    `// Click "Generate Automation Script" to compile Playwright/Selenium code`
  );
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  // Requirement parsing simulation
  const handleParseRequirements = () => {
    if (!reqText.trim() && !fileName) {
      alert('Please upload a specification file or paste requirement text first.');
      return;
    }

    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setParsedRequirements([
        'Feature 1: User Login & Session OAuth Token Management',
        'Feature 2: Account Outage Notification & Meter Reading Disputes',
        'Feature 3: API Payload Validation & Rate Limiting SLA (<500ms)',
      ]);
      setCurrentStep(2);
    }, 700);
  };

  // Compile automation code
  const handleGenerateScript = () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      setIsGeneratingScript(false);
      if (targetFramework === 'js') {
        setGeneratedCode(`import { test, expect } from '@playwright/test';

test.describe('${selectedSubProject?.name || 'Sub-Project'} Automation Suite', () => {
  const BASE_URL = '${targetUrl}';

  test('TC-GEN-01: Verify User Authentication & Session Token', async ({ page, request }) => {
    const response = await request.post(\`\${BASE_URL}/api/v1/auth/login\`, {
      data: { username: 'admin@promantus.com', password: 'secure_password' }
    });

    ${assertions.statusCode ? `expect(response.status()).toBe(200);` : ''}
    ${assertions.performanceSla ? `expect(response.timing().responseStart).toBeLessThan(500);` : ''}

    const payload = await response.json();
    ${assertions.jsonSchema ? `expect(payload).toHaveProperty('token');` : ''}

    await page.goto(BASE_URL);
    ${assertions.domVisibility ? `await expect(page.locator('#dashboard-view')).toBeVisible();` : ''}
  });
});`);
      } else if (targetFramework === 'py') {
        setGeneratedCode(`import pytest
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By

BASE_URL = "${targetUrl}"

def test_user_authentication():
    response = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
        "username": "admin@promantus.com",
        "password": "secure_password"
    })
    ${assertions.statusCode ? `assert response.status_code == 200` : ''}
    ${assertions.jsonSchema ? `assert "token" in response.json()` : ''}

    driver = webdriver.Chrome()
    driver.get(BASE_URL)
    ${assertions.domVisibility ? `assert driver.find_element(By.ID, "dashboard-view").is_displayed()` : ''}
    driver.quit()`);
      } else {
        setGeneratedCode(`package com.promantus.testing;

import org.junit.jupiter.Test;
import static org.junit.jupiter.Assertions.*;
import java.net.http.*;

public class ${selectedSubProject?.name?.replace(/[^a-zA-Z0-9]/g, '') || 'SubProject'}Test {
    private static final String BASE_URL = "${targetUrl}";

    @Test
    public void testUserAuthentication() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(java.net.URI.create(BASE_URL + "/api/v1/auth/login"))
            .POST(HttpRequest.BodyPublishers.ofString("{\\"username\\":\\"admin@promantus.com\\"}"))
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        ${assertions.statusCode ? `assertEquals(200, response.statusCode());` : ''}
    }
}`);
      }
    }, 600);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Stepper Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'white',
          borderRadius: '16px',
          padding: '16px 24px',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {[
          { num: 1, label: 'Requirement Input' },
          { num: 2, label: 'Generate Test Cases' },
          { num: 3, label: 'Generate Script' },
          { num: 4, label: 'Review & Export' },
        ].map((step, idx) => (
          <React.Fragment key={step.num}>
            <div
              onClick={() => setCurrentStep(step.num)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                opacity: currentStep === step.num ? 1 : 0.65,
                fontWeight: currentStep === step.num ? 700 : 500,
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: currentStep === step.num ? 'var(--teal)' : 'var(--off)',
                  color: currentStep === step.num ? 'white' : 'var(--text)',
                  border: currentStep === step.num ? 'none' : '1.5px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {currentStep > step.num ? '✓' : step.num}
              </div>
              <span style={{ fontSize: '13px', color: currentStep === step.num ? 'var(--navy)' : 'var(--muted)' }}>
                {step.label}
              </span>
            </div>
            {idx < 3 && <div style={{ color: 'var(--border)', fontWeight: 700 }}>→</div>}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: REQUIREMENT INPUT */}
      {currentStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="icon-badge-luxury">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>upload_file</span>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Requirement Specification Input</h3>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Upload PRD document or paste user story</span>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              style={{
                border: '2px dashed var(--border)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                background: 'var(--off)',
                cursor: 'pointer',
                marginBottom: '16px',
                transition: 'all 0.2s',
              }}
              onClick={() => {
                const fakeName = 'DEWA_Functional_Spec_v2.pdf';
                setFileName(fakeName);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--teal)', marginBottom: '8px' }}>cloud_upload</span>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>
                {fileName ? `Uploaded: ${fileName}` : 'Drop specification file here or click to browse'}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Supports PDF, DOCX, TXT, Markdown (max 15MB)</span>
            </div>

            <div className="field">
              <label>Or Paste User Story / Acceptance Criteria</label>
              <textarea
                rows={4}
                placeholder="User Story: As a customer, I want to authenticate securely via OAuth so that I can manage my utility bills..."
                value={reqText}
                onChange={(e) => setReqText(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button className="btn-sm btn-teal" onClick={handleParseRequirements} disabled={isParsing} style={{ width: '100%', padding: '12px' }}>
              {isParsing ? 'Parsing Requirements with AI...' : 'Parse Requirements →'}
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="icon-badge-luxury">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>fact_check</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Extracted Functional Features</h3>
            </div>

            {parsedRequirements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)', fontSize: '13px' }}>
                Upload or paste requirements on the left to extract functional features.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {parsedRequirements.map((feat, idx) => (
                  <div key={idx} style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>
                    ✓ {feat}
                  </div>
                ))}
                <button className="btn-sm btn-teal" onClick={() => setCurrentStep(2)} style={{ marginTop: '14px' }}>
                  Proceed to Generate Test Cases →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: GENERATE TEST CASES */}
      {currentStep === 2 && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '28px', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="icon-badge-luxury">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Test Cases Management</h3>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Structured scenarios generated by AI-First Test DNA</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-sm btn-ghost"
                onClick={() => {
                  const newId = `TC-GEN-0${testCases.length + 1}`;
                  setTestCases([...testCases, { id: newId, title: 'Verify Payload JSON Schema & SLA Response', category: 'API', type: 'Positive', priority: 'Medium' }]);
                }}
              >
                + Add Manual Test Case
              </button>
              <button className="btn-sm btn-teal" onClick={() => setCurrentStep(3)}>
                Proceed to Generate Script →
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>TC ID</th>
                  <th>Test Case Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((tc) => (
                  <tr key={tc.id}>
                    <td><strong style={{ color: 'var(--teal)', fontFamily: 'monospace' }}>{tc.id}</strong></td>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{tc.title}</td>
                    <td><span className="badge badge-navy">{tc.category}</span></td>
                    <td><span className="badge badge-ok">{tc.type}</span></td>
                    <td><span className="badge badge-navy" style={{ background: '#FEF3C7', color: '#92400E' }}>{tc.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 3: GENERATE SCRIPT */}
      {currentStep === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div className="icon-badge-luxury">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>code</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>Automation Script Setup</h3>
            </div>

            <div className="field">
              <label>Target Framework</label>
              <select value={targetFramework} onChange={(e) => setTargetFramework(e.target.value)}>
                <option value="js">Playwright — JavaScript / TypeScript</option>
                <option value="py">Selenium — Python</option>
                <option value="java">Selenium + JUnit — Java</option>
              </select>
            </div>

            <div className="field">
              <label>Target Environment Base URL</label>
              <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
            </div>

            <div className="field">
              <label>Include Automated Assertions</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--off)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={assertions.statusCode} onChange={(e) => setAssertions({ ...assertions, statusCode: e.target.checked })} style={{ accentColor: 'var(--teal)' }} /> Status Code (200 OK)
                </label>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={assertions.domVisibility} onChange={(e) => setAssertions({ ...assertions, domVisibility: e.target.checked })} style={{ accentColor: 'var(--teal)' }} /> DOM Visibility
                </label>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={assertions.jsonSchema} onChange={(e) => setAssertions({ ...assertions, jsonSchema: e.target.checked })} style={{ accentColor: 'var(--teal)' }} /> JSON Schema
                </label>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={assertions.performanceSla} onChange={(e) => setAssertions({ ...assertions, performanceSla: e.target.checked })} style={{ accentColor: 'var(--teal)' }} /> Response SLA (&lt;500ms)
                </label>
              </div>
            </div>

            <button className="btn-sm btn-teal" onClick={handleGenerateScript} disabled={isGeneratingScript} style={{ width: '100%', padding: '12px' }}>
              {isGeneratingScript ? 'Compiling Script...' : 'Generate Automation Script'}
            </button>
          </div>

          {/* Generated Code Output Box */}
          <div style={{ background: '#0B1740', borderRadius: '16px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--mint)' }}>Generated Automation Code</span>
              <button
                className="btn-sm btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  alert('Code copied to clipboard!');
                }}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                Copy Code
              </button>
            </div>

            <pre style={{ flex: 1, fontFamily: 'monospace', fontSize: '12px', color: '#A7F3D0', overflow: 'auto', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', margin: 0 }}>
              {generatedCode}
            </pre>

            <button className="btn-sm btn-teal" onClick={() => setCurrentStep(4)} style={{ marginTop: '16px', padding: '12px' }}>
              Proceed to Review & Export →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & EXPORT */}
      {currentStep === 4 && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)', padding: '32px', boxShadow: 'var(--shadow-xs)', textAlign: 'center' }}>
          <div className="icon-badge-luxury" style={{ width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 16px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>verified</span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>Test Suite Ready for Execution</h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Your automated test suite for <strong style={{ color: 'var(--navy)' }}>{selectedSubProject?.name || 'Sub-Project'}</strong> has been generated and validated.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-sm btn-teal" onClick={onNavigateToExecutor} style={{ padding: '12px 24px', fontSize: '14px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_circle</span>
              Send to Test Executor →
            </button>
            <button className="btn-sm btn-ghost" onClick={() => alert('Test Suite Bundle downloaded successfully!')} style={{ padding: '12px 20px', fontSize: '14px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
              Download Script Bundle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
