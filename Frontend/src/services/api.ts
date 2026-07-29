import type { Project, SubProject } from '../types/project';

const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all projects & embedded subprojects from Python FastAPI + MongoDB
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) {
    throw new Error(`HTTP error fetching projects: ${response.status}`);
  }
  const result = await response.json();
  return result.data || [];
};

// Create a new main project in MongoDB
export const createProjectApi = async (project: Project): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Failed to create project (${response.status})`);
  }

  const result = await response.json();
  return result.data;
};

// Update an existing project in MongoDB
export const updateProjectApi = async (id: string, updates: Partial<Project>): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update project (${response.status})`);
  }

  const result = await response.json();
  return result.data;
};

// Delete a project from MongoDB
export const deleteProjectApi = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete project (${response.status})`);
  }
};

// Create a subproject under a parent project in MongoDB
export const createSubProjectApi = async (projectId: string, subProject: SubProject): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/subprojects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subProject),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Failed to create sub-project (${response.status})`);
  }

  const result = await response.json();
  return result.data;
};

// Delete a subproject from a parent project in MongoDB
export const deleteSubProjectApi = async (projectId: string, subProjectId: string): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/subprojects/${subProjectId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete sub-project (${response.status})`);
  }

  const result = await response.json();
  return result.data;
};

// Update a subproject under a parent project in MongoDB
export const updateSubProjectApi = async (
  projectId: string,
  subProjectId: string,
  updates: Partial<SubProject>
): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/subprojects/${subProjectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Failed to update sub-project (${response.status})`);
  }

  const result = await response.json();
  return result.data;
};
