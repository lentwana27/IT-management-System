import { Organization, Branch, Department, User, AssetCategory, Asset, CheckoutRecord, MaintenanceRecord, BudgetAllocation, AuditLogItem, SystemNotification } from './types';

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org-mineazy',
    name: 'Mineazy Mining Solutions',
    type: 'Mining',
    logo: '',
    brandingColor: '#0f766e', // Teal 700
    branchesCount: 22 // 20 branches + 2 offices
  },
  {
    id: 'org-ebs',
    name: 'EBS (Eazy Business Solutions)',
    type: 'RetailIT',
    logo: '',
    brandingColor: '#4f46e5', // Indigo 600
    branchesCount: 3
  }
];

export const MINEAZY_BRANCHES: Branch[] = [];

export const EBS_BRANCHES: Branch[] = [];

export const DEPARTMENTS: Department[] = [
  { id: 'dept-ops', orgId: 'org-mineazy', name: 'Operations & Excavation', headCount: 0, budgetAllocated: 0 },
  { id: 'dept-it', orgId: 'org-mineazy', name: 'IT Infrastructure & Telemetry', headCount: 1, budgetAllocated: 0 },
  { id: 'dept-proc', orgId: 'org-mineazy', name: 'Procurement & Logistics', headCount: 0, budgetAllocated: 0 },
  { id: 'dept-hr', orgId: 'org-mineazy', name: 'Human Resources & Safety', headCount: 0, budgetAllocated: 0 },
  { id: 'dept-fin', orgId: 'org-mineazy', name: 'Finance & Asset Audit', headCount: 0, budgetAllocated: 0 },
  // EBS Depts
  { id: 'ebs-dept-sales', orgId: 'org-ebs', name: 'Retail Device Sales', headCount: 0, budgetAllocated: 0 },
  { id: 'ebs-dept-support', orgId: 'org-ebs', name: 'Client Tech Support', headCount: 0, budgetAllocated: 0 }
];

export const USERS: User[] = [
  { id: 'u-vision', orgId: 'org-mineazy', email: 'vision@mineazy.com', fullName: 'Vision (System Admin)', role: 'ADMIN', departmentId: 'dept-it', departmentName: 'IT Infrastructure & Telemetry', branchId: '', branchName: 'No Branch Assigned', twoFactorEnabled: false, password: 'MyAdmin30$', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' }
];

export const CATEGORIES: AssetCategory[] = [
  { id: 'cat-lap', name: 'Laptops', icon: '💻', description: 'Rugged field units & business ultraportables', depreciationYears: 3 },
  { id: 'cat-desk', name: 'Desktops & Workstations', icon: '🖥️', description: 'High-perf CAD/GIS engineering towers', depreciationYears: 4 },
  { id: 'cat-mon', name: 'Monitors & Displays', icon: '📺', description: '4K IPS & rugged field control screens', depreciationYears: 5 },
  { id: 'cat-phone', name: 'Phones', icon: '📱', description: 'Smartphones, iPhones, Android devices & business cellular handsets', depreciationYears: 2 },
  { id: 'cat-satcom', name: 'Satellite & Field Radios', icon: '📡', description: 'Satellite communicators, rugged field radios & transceivers', depreciationYears: 3 },
  { id: 'cat-net', name: 'Modems & Routers', icon: '🌐', description: 'Cisco industrial switches & Starlink receivers', depreciationYears: 5 },
  { id: 'cat-print', name: 'Printers & Plotters', icon: '🖨️', description: 'Large format geological map plotters & lasers', depreciationYears: 4 },
  { id: 'cat-pos', name: 'POS Systems & Scanners', icon: '🛒', description: 'Retail touchscreen registers & barcode readers', depreciationYears: 4 },
  { id: 'cat-periph', name: 'Keyboards & Mice', icon: '⌨️', description: 'Ergonomic & waterproof mechanical input gear', depreciationYears: 2 },
];

export const INITIAL_ASSETS: Asset[] = [];

export const INITIAL_CHECKOUTS: CheckoutRecord[] = [];

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [];

export const INITIAL_BUDGETS: BudgetAllocation[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  { id: 'aud-init', orgId: 'org-mineazy', userName: 'System', userRole: 'ADMIN', action: 'APPROVE_USERS', entityType: 'User', entityName: 'System', changes: 'Database initialized in empty production mode.', timestamp: 'Just now', ipAddress: '127.0.0.1' },
  { id: 'aud-init-ebs', orgId: 'org-ebs', userName: 'System', userRole: 'ADMIN', action: 'APPROVE_USERS', entityType: 'User', entityName: 'System', changes: 'Database initialized in empty production mode.', timestamp: 'Just now', ipAddress: '127.0.0.1' }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [];
