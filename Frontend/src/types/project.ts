export interface EnvironmentUrl {
  id?: string;
  env: string;
  url: string;
}

export interface SubProject {
  id: string;
  name: string;
  desc: string;
  icon?: string;
  type?: string;
  createdAt?: string;
  urls?: EnvironmentUrl[];
}

export interface Project {
  id: string;
  name: string;
  desc: string;
  baseUrl?: string;
  creationMethod?: string;
  status?: string;
  userStoriesCount?: number;
  testCasesCount?: number;
  scriptsCount?: number;
  icon?: string;
  category?: string;
  tags?: string[];
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
