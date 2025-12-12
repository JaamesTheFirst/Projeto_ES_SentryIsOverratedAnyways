// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  emailNotifications: boolean;
  browserNotifications: boolean;
  weeklySummary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status: 'active' | 'archived' | 'maintenance';
  apiKey: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
}

// Error types
export type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info';
export type ErrorStatus = 'unresolved' | 'resolved' | 'ignored';

export interface ErrorGroup {
  id: string;
  fingerprint: string;
  normalizedMessage: string;
  errorType: string;
  severity: ErrorSeverity;
  status: ErrorStatus;
  occurrenceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  file?: string;
  line?: number;
  functionName?: string;
  projectId: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  assignedTo?: User;
  occurrences?: ErrorOccurrence[];
}

export interface ErrorOccurrence {
  id: string;
  fullMessage: string;
  stackTrace: string;
  metadata?: {
    url?: string;
    userAgent?: string;
    environment?: string;
    framework?: string;
    browser?: string;
    os?: string;
    screen?: string;
    userId?: string;
    userName?: string;
    [key: string]: any;
  };
  errorGroupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorListResponse {
  items: ErrorGroup[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard types
export interface DashboardStats {
  totalErrors: number;
  unresolved: number;
  resolved: number;
  activeProjects: number;
  recentErrors: ErrorGroup[];
}

