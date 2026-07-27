import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Navbar } from './Components/Navbar';
import {
  ProjectsPage,
  SubProjectsPage,
  CreateProjectModal,
  CreateSubProjectModal,
} from './Components/Project';
import type { Project, SubProject, UserProfile } from './types/project';
import {
  fetchProjects,
  createProjectApi,
  deleteProjectApi,
  createSubProjectApi,
  deleteSubProjectApi,
} from './services/api';

const INITIAL_USER: UserProfile = {
  name: 'Admin User',
  role: 'Administrator',
  initials: 'AK',
  email: 'admin@promantus.com',
};

const STORAGE_KEY = 'ai_first_projects_data';

function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved projects state:', e);
      }
    }
    return [];
  });

  const [user] = useState<UserProfile>(INITIAL_USER);
  const [view, setView] = useState<'projects' | 'subprojects' | 'workspace'>('projects');
  const [selectedParentProject, setSelectedParentProject] = useState<Project | null>(null);
  const [selectedSubProject, setSelectedSubProject] = useState<SubProject | null>(null);
  const [loading, setLoading] = useState(false);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateSubProjectOpen, setIsCreateSubProjectOpen] = useState(false);

  // Ref guard to prevent duplicate API calls during React StrictMode initial rendering
  const fetchedRef = useRef(false);

  // Fetch projects from Python FastAPI + MongoDB backend on mount (runs exactly once)
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const loadProjects = async () => {
      setLoading(true);
      try {
        const apiProjects = await fetchProjects();
        setProjects(apiProjects);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiProjects));
      } catch (err) {
        console.warn('Backend API server offline or starting up, using local state:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleSelectParentProject = (project: Project) => {
    setSelectedParentProject(project);
    setView('subprojects');
  };

  const handleSelectSubProject = (subProject: SubProject) => {
    setSelectedSubProject(subProject);
    setView('workspace');
  };

  // Create Project via Python REST API
  const handleCreateProject = async (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);

    try {
      const created = await createProjectApi(newProject);
      if (created) {
        setProjects((prev) => prev.map((p) => (p.id === newProject.id ? created : p)));
      }
    } catch (err) {
      console.warn('Saved project locally (Python REST API offline):', err);
    }
  };

  // Delete Project via Python REST API
  const handleDeleteProject = async (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedParentProject?.id === projectId) {
      setSelectedParentProject(null);
      setView('projects');
    }

    try {
      await deleteProjectApi(projectId);
    } catch (err) {
      console.warn('Deleted project locally (Python REST API offline):', err);
    }
  };

  // Create Subproject via Python REST API
  const handleCreateSubProject = async (parentId: string, newSub: SubProject) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === parentId) {
          return {
            ...p,
            subProjects: [...(p.subProjects || []), newSub],
          };
        }
        return p;
      })
    );

    if (selectedParentProject?.id === parentId) {
      setSelectedParentProject((prev) =>
        prev
          ? {
              ...prev,
              subProjects: [...(prev.subProjects || []), newSub],
            }
          : null
      );
    }

    try {
      const updatedParent = await createSubProjectApi(parentId, newSub);
      if (updatedParent) {
        setProjects((prev) => prev.map((p) => (p.id === parentId ? updatedParent : p)));
        if (selectedParentProject?.id === parentId) {
          setSelectedParentProject(updatedParent);
        }
      }
    } catch (err) {
      console.warn('Saved sub-project locally (Python REST API offline):', err);
    }
  };

  // Delete Subproject via Python REST API
  const handleDeleteSubProject = async (parentId: string, subProjectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === parentId) {
          return {
            ...p,
            subProjects: (p.subProjects || []).filter((sp) => sp.id !== subProjectId),
          };
        }
        return p;
      })
    );

    if (selectedParentProject?.id === parentId) {
      setSelectedParentProject((prev) =>
        prev
          ? {
              ...prev,
              subProjects: (prev.subProjects || []).filter((sp) => sp.id !== subProjectId),
            }
          : null
      );
    }

    try {
      const updatedParent = await deleteSubProjectApi(parentId, subProjectId);
      if (updatedParent) {
        setProjects((prev) => prev.map((p) => (p.id === parentId ? updatedParent : p)));
        if (selectedParentProject?.id === parentId) {
          setSelectedParentProject(updatedParent);
        }
      }
    } catch (err) {
      console.warn('Deleted sub-project locally (Python REST API offline):', err);
    }
  };

  const handleBack = () => {
    if (view === 'workspace') {
      setView('subprojects');
    } else if (view === 'subprojects') {
      setView('projects');
      setSelectedParentProject(null);
    }
  };

  const navbarTitle =
    view === 'projects'
      ? 'AI First Test DNA'
      : view === 'subprojects'
      ? selectedParentProject?.name || 'Sub Projects'
      : `${selectedParentProject?.name} / ${selectedSubProject?.name}`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off)' }}>
      <Navbar
        title={navbarTitle}
        user={user}
        showBackButton={view !== 'projects'}
        onBack={handleBack}
        onSignOut={() => alert('Sign out clicked')}
      />

      {loading && projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '14px' }}>
          Loading workspaces from MongoDB backend...
        </div>
      )}

      {view === 'projects' && (
        <ProjectsPage
          projects={projects}
          onSelectProject={handleSelectParentProject}
          onCreateProjectClick={() => setIsCreateProjectOpen(true)}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {view === 'subprojects' && selectedParentProject && (
        <SubProjectsPage
          parentProject={selectedParentProject}
          onSelectSubProject={handleSelectSubProject}
          onCreateSubProjectClick={() => setIsCreateSubProjectOpen(true)}
          onBackToProjects={() => setView('projects')}
          onDeleteSubProject={handleDeleteSubProject}
        />
      )}

      {view === 'workspace' && selectedSubProject && (
        <div className="page" style={{ padding: '28px' }}>
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              border: '1.5px solid var(--border)',
              padding: '32px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(2, 168, 150, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--teal)' }}>
                  {selectedSubProject.icon || 'layers'}
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--teal)' }}>
                  {selectedSubProject.type || 'Sub-Project Workspace'}
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)', margin: '2px 0 0 0' }}>
                  {selectedSubProject.name}
                </h2>
              </div>
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              {selectedSubProject.desc || 'No description provided.'}
            </p>

            {selectedSubProject.urls && selectedSubProject.urls.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '10px' }}>
                  Configured Environment Endpoints:
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
                        fontSize: '12px',
                      }}
                    >
                      <strong style={{ color: 'var(--teal)', marginRight: '6px' }}>{u.env || 'Endpoint'}:</strong>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text)' }}>{u.url}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-sm btn-teal" onClick={() => alert(`Launching ${selectedSubProject.name}...`)}>
                Launch Automation Suite
              </button>
              <button className="btn-sm btn-ghost" onClick={() => setView('subprojects')}>
                Switch Sub-Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <CreateSubProjectModal
        isOpen={isCreateSubProjectOpen}
        projects={projects}
        selectedParentId={selectedParentProject?.id}
        onClose={() => setIsCreateSubProjectOpen(false)}
        onCreateSubProject={handleCreateSubProject}
      />
    </div>
  );
}

export default App;
