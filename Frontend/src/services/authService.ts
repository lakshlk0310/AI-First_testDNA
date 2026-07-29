import type { UserProfile } from '../types/project';

const SESSION_KEY = 'ai_first_auth_session';
const REMEMBER_KEY = 'ai_first_auth_remember';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

const DEFAULT_ADMIN: UserProfile = {
  name: 'Admin User',
  role: 'Administrator',
  initials: 'AK',
  email: 'admin@promantus.com',
};

// Check for existing saved session on startup
export const getStoredSession = (): AuthState => {
  try {
    // Check localStorage (Remember Me)
    const local = localStorage.getItem(SESSION_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      return { user: parsed.user, token: parsed.token || 'mock-jwt-token', isAuthenticated: true };
    }

    // Check sessionStorage
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      return { user: parsed.user, token: parsed.token || 'mock-jwt-token', isAuthenticated: true };
    }
  } catch (e) {
    console.error('Failed to parse auth session:', e);
  }

  return { user: null, token: null, isAuthenticated: false };
};

// Save session to storage
export const saveSession = (user: UserProfile, token: string = 'mock-jwt-token-12345', remember: boolean = true) => {
  const payload = JSON.stringify({ user, token, timestamp: new Date().toISOString() });
  if (remember) {
    localStorage.setItem(SESSION_KEY, payload);
    localStorage.setItem(REMEMBER_KEY, 'true');
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, payload);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }
};

// Clear session on logout
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};

// Generate initials from name
export const getInitials = (name: string): string => {
  if (!name.trim()) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const DEMO_USERS = {
  admin: DEFAULT_ADMIN,
  engineer: {
    name: 'Sarah Chen',
    role: 'QA Automation Lead',
    initials: 'SC',
    email: 'sarah.chen@promantus.com',
  },
  manager: {
    name: 'David Miller',
    role: 'Product Manager',
    initials: 'DM',
    email: 'david.miller@promantus.com',
  },
};
