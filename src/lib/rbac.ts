import { UserRole, User, Asset } from '../types';

export type ActionType =
  | 'VIEW_ALL_ASSETS'
  | 'CREATE_ASSET'
  | 'UPDATE_ASSET'
  | 'DELETE_ASSET'
  | 'MANAGE_USERS'
  | 'APPROVE_USERS'
  | 'VIEW_REPORTS'
  | 'VIEW_DEPRECIATION'
  | 'MANAGE_BUDGETS'
  | 'CREATE_MAINTENANCE'
  | 'UPDATE_MAINTENANCE'
  | 'CHECKOUT_ASSETS'
  | 'VIEW_ASSIGNED_ONLY';

/**
 * Role Permission Matrix defining granular access rights
 */
export const ROLE_PERMISSIONS: Record<UserRole, ActionType[]> = {
  ADMIN: [
    'VIEW_ALL_ASSETS',
    'CREATE_ASSET',
    'UPDATE_ASSET',
    'DELETE_ASSET',
    'MANAGE_USERS',
    'APPROVE_USERS',
    'VIEW_REPORTS',
    'VIEW_DEPRECIATION',
    'MANAGE_BUDGETS',
    'CREATE_MAINTENANCE',
    'UPDATE_MAINTENANCE',
    'CHECKOUT_ASSETS'
  ],
  DIRECTOR: [
    'VIEW_ALL_ASSETS',
    'VIEW_REPORTS',
    'VIEW_DEPRECIATION'
  ],
  BRANCH_MANAGER: [
    'VIEW_ALL_ASSETS', // Restricted by branch check
    'CREATE_ASSET',
    'UPDATE_ASSET',
    'CHECKOUT_ASSETS'
  ],
  IT_SUPPORT: [
    'VIEW_ALL_ASSETS',
    'CREATE_MAINTENANCE',
    'UPDATE_MAINTENANCE'
  ],
  FINANCE: [
    'VIEW_ALL_ASSETS',
    'VIEW_REPORTS',
    'VIEW_DEPRECIATION',
    'MANAGE_BUDGETS'
  ],
  USER: [
    'VIEW_ASSIGNED_ONLY',
    'CHECKOUT_ASSETS'
  ]
};

/**
 * Core Permission Check function
 * @param role UserRole
 * @param action ActionType
 * @returns boolean indicating if access is granted
 */
export function createPermissionCheck(role: UserRole, action: ActionType): boolean {
  if (role === 'ADMIN') return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action);
}

/**
 * Helper to check if a user can access a specific asset based on Branch/Assigned rules
 */
export function canAccessAsset(user: User, asset: Asset): boolean {
  // Must belong to the same organization
  if (user.orgId !== asset.orgId) return false;

  // Admins, Directors, IT Support, Finance can view all org assets
  if (['ADMIN', 'DIRECTOR', 'IT_SUPPORT', 'FINANCE'].includes(user.role)) {
    return true;
  }

  // Branch Managers and regular Users can only access assets in their specific branch
  if (user.role === 'BRANCH_MANAGER' || user.role === 'USER') {
    return user.branchId === asset.branchId;
  }

  return false;
}

/**
 * Simulated Next.js Middleware check: requireRole
 */
export function requireRole(userRole: UserRole, allowedRoles: UserRole[]): { allowed: boolean; status: number; error?: string } {
  if (allowedRoles.includes(userRole) || userRole === 'ADMIN') {
    return { allowed: true, status: 200 };
  }
  return {
    allowed: false,
    status: 403,
    error: `Access Denied: Requires role [${allowedRoles.join(', ')}]. Current role is ${userRole}.`
  };
}

/**
 * Simulated Next.js Middleware check: requireBranch
 */
export function requireBranch(userBranchId: string, requiredBranchId: string, userRole: UserRole): { allowed: boolean; status: number; error?: string } {
  if (userRole === 'ADMIN' || userRole === 'DIRECTOR') {
    return { allowed: true, status: 200 };
  }
  if (userBranchId === requiredBranchId) {
    return { allowed: true, status: 200 };
  }
  return {
    allowed: false,
    status: 403,
    error: `Branch Access Restriction: User branch (${userBranchId}) does not match required branch (${requiredBranchId}).`
  };
}

/**
 * Simulated Next.js Middleware check: requireDepartment
 */
export function requireDepartment(userDeptId: string, requiredDeptId: string, userRole: UserRole): { allowed: boolean; status: number; error?: string } {
  if (userRole === 'ADMIN') {
    return { allowed: true, status: 200 };
  }
  if (userDeptId === requiredDeptId) {
    return { allowed: true, status: 200 };
  }
  return {
    allowed: false,
    status: 403,
    error: `Department Access Restriction: User department (${userDeptId}) does not match required department (${requiredDeptId}).`
  };
}
