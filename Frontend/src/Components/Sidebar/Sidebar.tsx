import React from 'react';
import type { Project, SubProject, UserProfile } from '../../types/project';
import { TestDNAIcon } from '../Project/TestDNAIcon';

export interface NavRoute {
  id: string;
  label: string;
  icon: string;
  section: string;
  badge?: string;
}

export const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', section: 'Overview' },
    ],
  },
  {
    title: 'Functional Testing',
    items: [
      { id: 'test-generator', label: 'Test Generator', icon: 'auto_awesome', section: 'Functional Testing', badge: 'AI' },
      { id: 'test-executor', label: 'Test Executor', icon: 'play_circle', section: 'Functional Testing' },
      { id: 'test-analyzer', label: 'Test Analyzer', icon: 'analytics', section: 'Functional Testing' },
      { id: 'automation-api', label: 'API Testing', icon: 'api', section: 'Functional Testing' },
    ],
  },
  {
    title: 'AI Model Evaluation',
    items: [
      { id: 'synthetic-data', label: 'Synthetic Data Generator', icon: 'psychology', section: 'AI Model Evaluation' },
      { id: 'ground-truth', label: 'Ground Truth Dataset', icon: 'database', section: 'AI Model Evaluation' },
      { id: 'eval-execution', label: 'Evaluation Execution', icon: 'fact_check', section: 'AI Model Evaluation' },
      { id: 'eval-results', label: 'Results Dashboard', icon: 'insights', section: 'AI Model Evaluation' },
    ],
  },
  {
    title: 'Business Testing',
    items: [
      { id: 'admin-scoring', label: 'Admin Scoring', icon: 'admin_panel_settings', section: 'Business Testing' },
      { id: 'uat-dashboard', label: 'UAT Dashboard', icon: 'dashboard_customize', section: 'Business Testing' },
    ],
  },
];

interface SidebarProps {
  activeRoute: string;
  onSelectRoute: (routeId: string) => void;
  selectedProject: Project | null;
  selectedSubProject: SubProject | null;
  user: UserProfile;
  onSwitchWorkspace: () => void;
  onSignOut: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onSelectRoute,
  selectedProject,
  selectedSubProject,
  user,
  onSwitchWorkspace,
  onSignOut,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Toggle Floating Button */}
      <button
        className="sidebar-toggle"
        onClick={onToggleCollapse}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label="Toggle Sidebar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-row">
          <div className="b-dot" title="AI-First Test DNA">
            <TestDNAIcon size={20} variant="white" />
          </div>
          <div className="brand-text">
            <h1>AI-First Test DNA</h1>
            <span>Promantus AI Platform</span>
          </div>
        </div>
        <div className="sidebar-badge">
          <div className="pulse" /> Live
        </div>
      </div>

      {/* Active Workspace Widget */}
      {selectedSubProject && (
        <div
          className="sidebar-workspace-widget"
          onClick={onSwitchWorkspace}
          title="Click to switch workspace sub-project"
        >
          <span className="ws-title">Active Workspace</span>
          <span className="ws-project">{selectedProject?.name || 'Project'}</span>
          <span className="ws-subproject">
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--mint)' }}>
              {selectedSubProject.icon || 'layers'}
            </span>
            {selectedSubProject.name}
          </span>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="sidebar-nav">
        {NAV_SECTIONS.map((sec, sIdx) => (
          <div key={sIdx} className="nav-section">
            <div className="nav-label">{sec.title}</div>
            {sec.items.map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <div
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectRoute(item.id)}
                  data-title={item.label}
                  role="button"
                  tabIndex={0}
                >
                  <span className="material-symbols-outlined nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer User Chip */}
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{user.initials}</div>
          <div className="user-info">
            <span className="name">{user.name}</span>
            <span className="role">{user.role}</span>
          </div>
          <button className="logout-btn" onClick={onSignOut} title="Sign Out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
