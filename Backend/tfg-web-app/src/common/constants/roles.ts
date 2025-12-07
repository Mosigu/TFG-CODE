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

export enum TaskRole {
  ASSIGNED = 'assigned',
  REVIEWER = 'reviewer',
  OBSERVER = 'observer',
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

export function hasRoleOrHigher(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function hasProjectRoleOrHigher(projectRole: ProjectRole, requiredRole: ProjectRole): boolean {
  return PROJECT_ROLE_HIERARCHY[projectRole] >= PROJECT_ROLE_HIERARCHY[requiredRole];
}

export function canPerformAction(userRole: UserRole, action: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[userRole]?.[action] ?? false;
}
