export interface EnvironmentUrl {
  id?: string;
  env: string;
  url: string;
}

export interface SubProject {
  id: string;
  name: string;
  desc: string;
  type?: string;
  icon?: string;
  createdAt?: string;
  urls?: EnvironmentUrl[];
  userStoriesCount?: number;
  testCasesCount?: number;
  scriptsCount?: number;
}

export interface Project {
  id: string;
  name: string;
  desc: string;
  baseUrl?: string;
  status?: string;
  icon?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  subProjects: SubProject[];
}

export interface UserProfile {
  name: string;
  role: string;
  initials: string;
  email: string;
  avatarUrl?: string;
}
