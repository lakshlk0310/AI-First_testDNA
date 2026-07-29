import { useState, useEffect, useRef } from 'react';
import './App.css';
import { AuthPage } from './Components/Auth';
import { Navbar } from './Components/Navbar';
import { Sidebar } from './Components/Sidebar';
import { WorkspaceDashboard, UnderDevelopment } from './Components/Workspace';

import {
  ProjectsPage,
  SubProjectsPage,
  CreateProjectModal,
  CreateSubProjectModal,
  EditProjectModal,
  EditSubProjectModal,
} from './Components/Project';
import type { Project, SubProject, UserProfile } from './types/project';
import {
  fetchProjects,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  createSubProjectApi,
  updateSubProjectApi,
  deleteSubProjectApi,
} from './services/api';
import { getStoredSession, clearSession } from './services/authService';

const STORAGE_KEY = 'ai_first_projects_data';

function App() {
  // Session State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const session = getStoredSession();
    return session.user;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const session = getStoredSession();
    return session.isAuthenticated;
  });

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

  const [view, setView] = useState<'projects' | 'subprojects' | 'workspace'>('projects');
  const [selectedParentProject, setSelectedParentProject] = useState<Project | null>(null);
  const [selectedSubProject, setSelectedSubProject] = useState<SubProject | null>(null);
  const [activeRoute, setActiveRoute] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateSubProjectOpen, setIsCreateSubProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSubProject, setEditingSubProject] = useState<{ parentId: string; subProject: SubProject } | null>(null);

  // Ref guard to prevent duplicate API calls during React StrictMode initial rendering
  const fetchedRef = useRef(false);

  // Fetch projects from Python FastAPI + MongoDB backend on mount if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

  // Sync state to LocalStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  // Auto-dismiss Toast Message
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsAuthenticated(true);
    setView('projects');
    setToastMessage(`Welcome back, ${userProfile.name}!`);
  };

  const handleSignOut = () => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
    setView('projects');
    setSelectedParentProject(null);
    setSelectedSubProject(null);
  };

  const handleSelectParentProject = (project: Project) => {
    setSelectedParentProject(project);
    setView('subprojects');
  };

  // Redirect to Dashboard when user selects a sub-project
  const handleSelectSubProject = (subProject: SubProject) => {
    setSelectedSubProject(subProject);
    setActiveRoute('dashboard');
    setView('workspace');
  };

  // Create Project via Python REST API
  const handleCreateProject = async (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setToastMessage(`Project "${newProject.name}" created successfully.`);

    try {
      const created = await createProjectApi(newProject);
      if (created) {
        setProjects((prev) => prev.map((p) => (p.id === newProject.id ? created : p)));
      }
    } catch (err) {
      console.warn('Saved project locally (Python REST API offline):', err);
    }
  };

  // Edit Project via Python REST API
  const handleUpdateProject = async (updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
    if (selectedParentProject?.id === updatedProject.id) {
      setSelectedParentProject(updatedProject);
    }
    setToastMessage(`Project "${updatedProject.name}" updated successfully.`);

    try {
      await updateProjectApi(updatedProject.id, updatedProject);
    } catch (err) {
      console.warn('Updated project locally (Python REST API offline):', err);
    }
  };

  // Delete Project via Python REST API
  const handleDeleteProject = async (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedParentProject?.id === projectId) {
      setSelectedParentProject(null);
      setView('projects');
    }
    setToastMessage(`Project "${target?.name || projectId}" deleted.`);

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
    setToastMessage(`Sub-project "${newSub.name}" created successfully.`);

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

  // Edit Subproject via Python REST API
  const handleUpdateSubProject = async (parentId: string, updatedSub: SubProject) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === parentId) {
          return {
            ...p,
            subProjects: (p.subProjects || []).map((sp) => (sp.id === updatedSub.id ? updatedSub : sp)),
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
            subProjects: (prev.subProjects || []).map((sp) => (sp.id === updatedSub.id ? updatedSub : sp)),
          }
          : null
      );
    }

    if (selectedSubProject?.id === updatedSub.id) {
      setSelectedSubProject(updatedSub);
    }

    setToastMessage(`Sub-project "${updatedSub.name}" updated successfully.`);

    try {
      await updateSubProjectApi(parentId, updatedSub.id, updatedSub);
    } catch (err) {
      console.warn('Updated sub-project locally (Python REST API offline):', err);
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
    setToastMessage('Sub-project deleted.');

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
    view === 'projects' || view === 'subprojects'
      ? 'AI First Test DNA'
      : `${selectedParentProject?.name} / ${selectedSubProject?.name}`;

  // IF NOT AUTHENTICATED -> RENDER AUTH PAGE
  if (!isAuthenticated || !user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // IF AUTHENTICATED -> RENDER APPLICATION WORKSPACE
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', position: 'relative' }}>
      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--navy)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-md)',
            zIndex: 1000,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid rgba(2, 195, 154, 0.3)',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--mint)', fontSize: '18px' }}>
            check_circle
          </span>
          {toastMessage}
        </div>
      )}

      {/* Workspace Dashboard View with Sidebar App Shell layout */}
      {view === 'workspace' && selectedSubProject ? (
        <div className="app-shell">
          <Sidebar
            activeRoute={activeRoute}
            onSelectRoute={(routeId) => setActiveRoute(routeId)}
            selectedProject={selectedParentProject}
            selectedSubProject={selectedSubProject}
            user={user}
            onSwitchWorkspace={() => setView('subprojects')}
            onSignOut={handleSignOut}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
            <Navbar
              title={navbarTitle}
              user={user}
              showBackButton={true}
              onBack={handleBack}
              onSignOut={handleSignOut}
            />

            {activeRoute === 'dashboard' ? (
              <WorkspaceDashboard
                selectedProject={selectedParentProject}
                selectedSubProject={selectedSubProject}
                onSwitchWorkspace={() => setView('subprojects')}
              />
            ) : (
              <UnderDevelopment
                routeId={activeRoute}
                onGoToDashboard={() => setActiveRoute('dashboard')}
              />
            )}
          </div>
        </div>
      ) : (
        /* Projects and Sub-Projects selection views */
        <div>
          <Navbar
            title={navbarTitle}
            user={user}
            showBackButton={view !== 'projects'}
            onBack={handleBack}
            onSignOut={handleSignOut}
          />

          {view === 'projects' && (
            <ProjectsPage
              projects={projects}
              loading={loading}
              onSelectProject={handleSelectParentProject}
              onCreateProjectClick={() => setIsCreateProjectOpen(true)}
              onEditProject={(p) => setEditingProject(p)}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {view === 'subprojects' && selectedParentProject && (
            <SubProjectsPage
              parentProject={selectedParentProject}
              loading={loading}
              onSelectSubProject={handleSelectSubProject}
              onCreateSubProjectClick={() => setIsCreateSubProjectOpen(true)}
              onEditSubProject={(parentId, sp) => setEditingSubProject({ parentId, subProject: sp })}
              onBackToProjects={() => setView('projects')}
              onDeleteSubProject={handleDeleteSubProject}
            />
          )}
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

      <EditProjectModal
        isOpen={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSaveProject={handleUpdateProject}
      />

      <EditSubProjectModal
        isOpen={!!editingSubProject}
        parentProjectId={editingSubProject?.parentId || ''}
        subProject={editingSubProject?.subProject || null}
        onClose={() => setEditingSubProject(null)}
        onSaveSubProject={handleUpdateSubProject}
      />
    </div>
  );
}

export default App;
