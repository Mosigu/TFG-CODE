export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

export enum ProjectRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  COLLABORATOR = 'collaborator',
  VIEWER = 'viewer',
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 4,
  [UserRole.MANAGER]: 3,
  [UserRole.CONTRIBUTOR]: 2,
  [UserRole.VIEWER]: 1,
};

export const PROJECT_ROLE_HIERARCHY: Record<ProjectRole, number> = {
  [ProjectRole.OWNER]: 4,
  [ProjectRole.MANAGER]: 3,
  [ProjectRole.COLLABORATOR]: 2,
  [ProjectRole.VIEWER]: 1,
};

export interface RolePermissions {
  canManageUsers: boolean;
  canManageRoles: boolean;
  canCreateProjects: boolean;
  canDeleteProjects: boolean;
  canManageProjectMembers: boolean;
  canCreateTasks: boolean;
  canUpdateTasks: boolean;
  canDeleteTasks: boolean;
  canUpdateTaskStatus: boolean;
  canViewProjects: boolean;
  canViewTasks: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageRoles: true,
    canCreateProjects: true,
    canDeleteProjects: true,
    canManageProjectMembers: true,
    canCreateTasks: true,
    canUpdateTasks: true,
    canDeleteTasks: true,
    canUpdateTaskStatus: true,
    canViewProjects: true,
    canViewTasks: true,
  },
  [UserRole.MANAGER]: {
    canManageUsers: false,
    canManageRoles: false,
    canCreateProjects: true,
    canDeleteProjects: true,
    canManageProjectMembers: true,
    canCreateTasks: true,
    canUpdateTasks: true,
    canDeleteTasks: true,
    canUpdateTaskStatus: true,
    canViewProjects: true,
    canViewTasks: true,
  },
  [UserRole.CONTRIBUTOR]: {
    canManageUsers: false,
    canManageRoles: false,
    canCreateProjects: false,
    canDeleteProjects: false,
    canManageProjectMembers: false,
    canCreateTasks: true,
    canUpdateTasks: true,
    canDeleteTasks: false,
    canUpdateTaskStatus: true,
    canViewProjects: true,
    canViewTasks: true,
  },
  [UserRole.VIEWER]: {
    canManageUsers: false,
    canManageRoles: false,
    canCreateProjects: false,
    canDeleteProjects: false,
    canManageProjectMembers: false,
    canCreateTasks: false,
    canUpdateTasks: false,
    canDeleteTasks: false,
    canUpdateTaskStatus: false,
    canViewProjects: true,
    canViewTasks: true,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.CONTRIBUTOR]: 'Contributor',
  [UserRole.VIEWER]: 'Viewer',
};

export const PROJECT_ROLE_LABELS: Record<ProjectRole, string> = {
  [ProjectRole.OWNER]: 'Owner',
  [ProjectRole.MANAGER]: 'Manager',
  [ProjectRole.COLLABORATOR]: 'Collaborator',
  [ProjectRole.VIEWER]: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Full system access. Can manage users, roles, and all system configurations.',
  [UserRole.MANAGER]: 'Can create and manage projects, assign team members, and oversee project execution.',
  [UserRole.CONTRIBUTOR]: 'Can execute tasks, update task statuses, and record project progress.',
  [UserRole.VIEWER]: 'Read-only access. Can view project information and track progress.',
};

export function hasRoleOrHigher(userRole: string, requiredRole: UserRole): boolean {
  const userRoleEnum = userRole as UserRole;
  if (!Object.values(UserRole).includes(userRoleEnum)) return false;
  return ROLE_HIERARCHY[userRoleEnum] >= ROLE_HIERARCHY[requiredRole];
}

export function hasProjectRoleOrHigher(projectRole: string, requiredRole: ProjectRole): boolean {
  const projectRoleEnum = projectRole as ProjectRole;
  if (!Object.values(ProjectRole).includes(projectRoleEnum)) return false;
  return PROJECT_ROLE_HIERARCHY[projectRoleEnum] >= PROJECT_ROLE_HIERARCHY[requiredRole];
}

export function canPerformAction(userRole: string, action: keyof RolePermissions): boolean {
  const role = userRole as UserRole;
  return ROLE_PERMISSIONS[role]?.[action] ?? false;
}

export function getUserPermissions(userRole: string): RolePermissions {
  const role = userRole as UserRole;
  return ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS[UserRole.VIEWER];
}

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role as UserRole] ?? role;
}

export function getProjectRoleLabel(role: string): string {
  return PROJECT_ROLE_LABELS[role as ProjectRole] ?? role;
}

export function getRoleDescription(role: string): string {
  return ROLE_DESCRIPTIONS[role as UserRole] ?? '';
}

export function canUserManageProject(
  userRole: string,
  projectRole?: string
): boolean {
  if (userRole === UserRole.ADMIN) return true;
  if (!projectRole) return false;
  return hasProjectRoleOrHigher(projectRole, ProjectRole.MANAGER);
}

export function canUserEditTask(
  userRole: string,
  projectRole?: string,
  isAssigned?: boolean
): boolean {
  if (userRole === UserRole.ADMIN) return true;
  if (isAssigned) return true;
  if (!projectRole) return false;
  return hasProjectRoleOrHigher(projectRole, ProjectRole.COLLABORATOR);
}

export function canUserDeleteTask(
  userRole: string,
  projectRole?: string
): boolean {
  if (userRole === UserRole.ADMIN) return true;
  if (!projectRole) return false;
  return hasProjectRoleOrHigher(projectRole, ProjectRole.MANAGER);
}

export function canUserAssignMembers(
  userRole: string,
  projectRole?: string
): boolean {
  if (userRole === UserRole.ADMIN) return true;
  if (!projectRole) return false;
  return hasProjectRoleOrHigher(projectRole, ProjectRole.MANAGER);
}

export interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  role: string;
  profilePictureURL?: string;
  managerId?: string;
}

export interface UserProjectRole {
  userId: string;
  projectId: string;
  role: string;
}

export function getCurrentUserRole(): string {
  if (typeof window === 'undefined') return UserRole.VIEWER;
  const userStr = localStorage.getItem('current_user');
  if (!userStr || userStr === 'undefined') return UserRole.VIEWER;
  try {
    const user = JSON.parse(userStr) as User;
    return user.role || UserRole.VIEWER;
  } catch {
    return UserRole.VIEWER;
  }
}

export function isAdmin(): boolean {
  return getCurrentUserRole() === UserRole.ADMIN;
}

export function isManager(): boolean {
  const role = getCurrentUserRole();
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

export function isContributor(): boolean {
  const role = getCurrentUserRole();
  return hasRoleOrHigher(role, UserRole.CONTRIBUTOR);
}
