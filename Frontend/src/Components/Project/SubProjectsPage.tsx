import React, { useState } from 'react';
import type { Project, SubProject } from '../../types/project';

interface SubProjectsPageProps {
  parentProject: Project;
  onSelectSubProject: (subProject: SubProject) => void;
  onCreateSubProjectClick: () => void;
  onBackToProjects: () => void;
  onDeleteSubProject?: (projectId: string, subProjectId: string) => void;
}

export const SubProjectsPage: React.FC<SubProjectsPageProps> = ({
  parentProject,
  onSelectSubProject,
  onCreateSubProjectClick,
  onDeleteSubProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubProjects = (parentProject.subProjects || []).filter((sp) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      sp.name.toLowerCase().includes(q) ||
      (sp.desc && sp.desc.toLowerCase().includes(q)) ||
      sp.id.toLowerCase().includes(q) ||
      (sp.type && sp.type.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--navy)', fontWeight: 700, margin: 0 }}>
            {parentProject.name}
          </h3>
          <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
            Select a sub-project workspace to enter
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Dynamic Search */}
          {(parentProject.subProjects || []).length > 0 && (
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search sub-projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <button className="btn-sm btn-teal" onClick={onCreateSubProjectClick} style={{ fontWeight: 700 }}>
            + Create Sub Project
          </button>
        </div>
      </div>

      {filteredSubProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <span className="material-symbols-outlined">layers_clear</span>
          </div>
          <h4>No Sub Projects Found</h4>
          <p>
            {searchQuery
              ? `No sub-projects match "${searchQuery}".`
              : `No sub-project workspaces configured under ${parentProject.name} yet.`}
          </p>
          {searchQuery ? (
            <button className="btn-sm btn-ghost" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          ) : (
            <button className="btn-sm btn-teal" onClick={onCreateSubProjectClick}>
              + Create Sub Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid-cards">
          {filteredSubProjects.map((sp) => (
            <div key={sp.id} className="card-select" onClick={() => onSelectSubProject(sp)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(2, 168, 150, 0.1)',
                    color: 'var(--teal2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--teal)' }}>
                    {sp.icon || 'layers'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-ok">
                    {sp.urls ? sp.urls.length : 0} Environment URLs
                  </span>
                  {onDeleteSubProject && (
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.15s',
                      }}
                      title="Delete Sub-Project"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${sp.name}"?`)) {
                          onDeleteSubProject(parentProject.id, sp.id);
                        }
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="card-title" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
                {sp.name}
              </div>

              <div
                style={{
                  fontSize: '12.5px',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                  marginBottom: '16px',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {sp.desc || 'No description provided.'}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '12px',
                  marginTop: 'auto',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ID: {sp.id}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  Launch Workspace{' '}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
