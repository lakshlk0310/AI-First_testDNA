import React, { useState } from 'react';
import type { Project } from '../../types/project';

interface ProjectsPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProjectClick: () => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onSelectProject,
  onCreateProjectClick,
  onDeleteProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.desc && p.desc.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--navy)', fontWeight: 700, margin: 0 }}>
            Active Project Workspaces
          </h3>
          <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
            Select a workspace below or add a new solution to proceed
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Dynamic Search Box */}
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search projects by name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn-sm btn-teal" onClick={onCreateProjectClick} style={{ fontWeight: 700 }}>
            + Create Project
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <span className="material-symbols-outlined">folder_open</span>
          </div>
          <h4>No Projects Found</h4>
          <p>
            {searchQuery
              ? `No projects match "${searchQuery}". Try clearing your search filter.`
              : 'No active project workspaces yet. Click "+ Create Project" to set up your first solution.'}
          </p>
          {searchQuery ? (
            <button className="btn-sm btn-ghost" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          ) : (
            <button className="btn-sm btn-teal" onClick={onCreateProjectClick}>
              + Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid-cards">
          {filteredProjects.map((mp) => (
            <div key={mp.id} className="card-select" onClick={() => onSelectProject(mp)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div className="icon-badge-luxury">
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    {mp.icon || 'folder'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-navy">
                    {mp.subProjects ? mp.subProjects.length : 0} Sub Projects
                  </span>
                  {onDeleteProject && (
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
                      title="Delete Project"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${mp.name}"?`)) {
                          onDeleteProject(mp.id);
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

              <div className="card-title" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
                {mp.name}
              </div>

              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                  marginBottom: '14px',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {mp.desc || 'No description provided.'}
              </div>

              {/* Dynamic Tags */}
              {mp.tags && mp.tags.length > 0 && (
                <div className="tag-list" style={{ marginBottom: '14px' }}>
                  {mp.tags.map((t, idx) => (
                    <span key={idx} className="tag-item">
                      {t}
                    </span>
                  ))}
                </div>
              )}

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
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal)' }}>
                  {mp.category || 'General'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Workspaces{' '}
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
