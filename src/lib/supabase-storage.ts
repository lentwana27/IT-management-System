import { supabase, isSupabaseConfigured } from './supabase-client';
import {
  Asset,
  CheckoutRecord,
  MaintenanceRecord,
  BudgetAllocation,
  AuditLogItem,
  SystemNotification,
  User,
  Branch
} from '../types';
import {
  INITIAL_ASSETS,
  INITIAL_CHECKOUTS,
  INITIAL_MAINTENANCE,
  INITIAL_BUDGETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  USERS,
  MINEAZY_BRANCHES,
  EBS_BRANCHES
} from '../mockData';

// Local storage keys for resilient offline-first caching
const STORAGE_KEYS = {
  ASSETS: 'mineazy_it_assets_v2',
  CHECKOUTS: 'mineazy_it_checkouts_v2',
  MAINTENANCES: 'mineazy_it_maintenances_v2',
  BUDGETS: 'mineazy_it_budgets_v2',
  AUDIT_LOGS: 'mineazy_it_audit_logs_v2',
  NOTIFICATIONS: 'mineazy_it_notifications_v2',
  USERS: 'mineazy_it_users_v2',
  BRANCHES: 'mineazy_it_branches_v2',
  LAST_SYNC: 'mineazy_it_last_sync_timestamp'
};

// --- Mappers between Frontend Model (camelCase) and Postgres / Supabase (snake_case) ---

export const mapAssetToRow = (asset: Asset) => ({
  id: asset.id,
  org_id: asset.orgId,
  branch_id: asset.branchId,
  branch_name: asset.branchName,
  category_id: asset.categoryId,
  category_name: asset.categoryName || asset.category || 'Hardware',
  category: asset.category || asset.categoryName || 'Hardware',
  asset_code: asset.assetCode,
  name: asset.name,
  model: asset.model || '',
  serial_number: asset.serialNumber,
  mac_address: asset.macAddress || null,
  phone_number: asset.phoneNumber || null,
  registered_email: asset.registeredEmail || null,
  imei_number: asset.imeiNumber || null,
  status: asset.status,
  condition: asset.condition,
  purchase_date: asset.purchaseDate,
  purchase_cost: asset.purchaseCost,
  warranty_expiry: asset.warrantyExpiry,
  current_value: asset.currentValue,
  assigned_to_user_id: asset.assignedToUserId || null,
  assigned_to_user_name: asset.assignedToUserName || null,
  assigned_at: asset.assignedAt || null,
  image_url: asset.imageUrl || '',
  notes: asset.notes || null,
  updated_at: new Date().toISOString()
});

export const mapRowToAsset = (row: any): Asset => ({
  id: row.id,
  orgId: row.org_id,
  branchId: row.branch_id,
  branchName: row.branch_name,
  categoryId: row.category_id,
  categoryName: row.category_name || row.category || 'Hardware',
  category: row.category || row.category_name || 'Hardware',
  assetCode: row.asset_code,
  name: row.name,
  model: row.model || '',
  serialNumber: row.serial_number,
  macAddress: row.mac_address || undefined,
  phoneNumber: row.phone_number || undefined,
  registeredEmail: row.registered_email || undefined,
  imeiNumber: row.imei_number || undefined,
  status: row.status,
  condition: row.condition,
  purchaseDate: row.purchase_date,
  purchaseCost: Number(row.purchase_cost) || 0,
  warrantyExpiry: row.warranty_expiry,
  currentValue: Number(row.current_value) || 0,
  assignedToUserId: row.assigned_to_user_id || undefined,
  assignedToUserName: row.assigned_to_user_name || undefined,
  assignedAt: row.assigned_at || undefined,
  imageUrl: row.image_url || '',
  notes: row.notes || undefined
});

export const mapCheckoutToRow = (chk: CheckoutRecord) => ({
  id: chk.id,
  asset_id: chk.assetId,
  asset_code: chk.assetCode,
  asset_name: chk.assetName,
  checked_out_by: chk.checkedOutBy,
  checked_out_to_user_id: chk.checkedOutToUserId,
  checked_out_to_user_name: chk.checkedOutToUserName,
  checked_out_at: chk.checkedOutAt,
  expected_return_date: chk.expectedReturnDate || null,
  checked_in_at: chk.checkedInAt || null,
  return_condition: chk.returnCondition || null,
  damage_reported: Boolean(chk.damageReported),
  damage_description: chk.damageDescription || null,
  reason: chk.reason,
  status: chk.status,
  notes: chk.notes || null,
  updated_at: new Date().toISOString()
});

export const mapRowToCheckout = (row: any): CheckoutRecord => ({
  id: row.id,
  assetId: row.asset_id,
  assetCode: row.asset_code,
  assetName: row.asset_name,
  checkedOutBy: row.checked_out_by,
  checkedOutToUserId: row.checked_out_to_user_id,
  checkedOutToUserName: row.checked_out_to_user_name,
  checkedOutAt: row.checked_out_at,
  expectedReturnDate: row.expected_return_date || undefined,
  checkedInAt: row.checked_in_at || undefined,
  returnCondition: row.return_condition || undefined,
  damageReported: Boolean(row.damage_reported),
  damageDescription: row.damage_description || undefined,
  reason: row.reason,
  status: row.status,
  notes: row.notes || undefined
});

export const mapMaintenanceToRow = (mnt: MaintenanceRecord) => ({
  id: mnt.id,
  asset_id: mnt.assetId,
  asset_code: mnt.assetCode,
  asset_name: mnt.assetName,
  type: mnt.type,
  status: mnt.status,
  priority: mnt.priority || 'MEDIUM',
  description: mnt.description,
  reported_by: mnt.reportedBy,
  assigned_technician: mnt.assignedTechnician,
  start_date: mnt.startDate,
  expected_completion: mnt.expectedCompletion,
  actual_completion: mnt.actualCompletion || null,
  cost: Number(mnt.cost) || 0,
  parts_replaced: mnt.partsReplaced || null,
  notes: mnt.notes || null,
  audit_logs: mnt.auditLogs ? JSON.stringify(mnt.auditLogs) : null,
  updated_at: new Date().toISOString()
});

export const mapRowToMaintenance = (row: any): MaintenanceRecord => {
  let auditLogsParsed: any[] | undefined = undefined;
  if (row.audit_logs) {
    try {
      auditLogsParsed = typeof row.audit_logs === 'string' ? JSON.parse(row.audit_logs) : row.audit_logs;
    } catch {
      auditLogsParsed = undefined;
    }
  }
  return {
    id: row.id,
    assetId: row.asset_id,
    assetCode: row.asset_code,
    assetName: row.asset_name,
    type: row.type,
    status: row.status,
    priority: row.priority || 'MEDIUM',
    description: row.description,
    reportedBy: row.reported_by,
    assignedTechnician: row.assigned_technician,
    startDate: row.start_date,
    expectedCompletion: row.expected_completion,
    actualCompletion: row.actual_completion || undefined,
    cost: Number(row.cost) || 0,
    partsReplaced: row.parts_replaced || undefined,
    notes: row.notes || undefined,
    auditLogs: auditLogsParsed
  };
};

export const mapBudgetToRow = (b: BudgetAllocation) => ({
  id: b.id,
  org_id: b.orgId,
  department_name: b.departmentName,
  branch_name: b.branchName,
  fiscal_year: b.fiscalYear,
  allocated: Number(b.allocated) || 0,
  spent: Number(b.spent) || 0,
  updated_at: new Date().toISOString()
});

export const mapRowToBudget = (row: any): BudgetAllocation => ({
  id: row.id,
  orgId: row.org_id,
  departmentName: row.department_name,
  branchName: row.branch_name,
  fiscalYear: Number(row.fiscal_year) || 2026,
  allocated: Number(row.allocated) || 0,
  spent: Number(row.spent) || 0
});

export const mapAuditToRow = (log: AuditLogItem) => ({
  id: log.id,
  org_id: log.orgId,
  user_name: log.userName,
  user_role: log.userRole,
  action: log.action,
  entity_type: log.entityType,
  entity_name: log.entityName,
  changes: log.changes,
  timestamp: log.timestamp,
  ip_address: log.ipAddress || null,
  created_at: new Date().toISOString()
});

export const mapRowToAudit = (row: any): AuditLogItem => ({
  id: row.id,
  orgId: row.org_id,
  userName: row.user_name,
  userRole: row.user_role,
  action: row.action,
  entityType: row.entity_type,
  entityName: row.entity_name,
  changes: row.changes,
  timestamp: row.timestamp,
  ipAddress: row.ip_address || undefined
});

export const mapNotificationToRow = (n: SystemNotification) => ({
  id: n.id,
  org_id: n.orgId,
  type: n.type,
  title: n.title,
  message: n.message,
  timestamp: n.timestamp,
  read: Boolean(n.read),
  updated_at: new Date().toISOString()
});

export const mapRowToNotification = (row: any): SystemNotification => ({
  id: row.id,
  orgId: row.org_id,
  type: row.type,
  title: row.title,
  message: row.message,
  timestamp: row.timestamp,
  read: Boolean(row.read)
});

export const mapUserToRow = (u: User) => ({
  id: u.id,
  org_id: u.orgId,
  email: u.email,
  full_name: u.fullName,
  role: u.role,
  department_id: u.departmentId || '',
  department_name: u.departmentName || '',
  branch_id: u.branchId || '',
  branch_name: u.branchName || '',
  two_factor_enabled: Boolean(u.twoFactorEnabled),
  avatar: u.avatar || '',
  password: u.password || null,
  updated_at: new Date().toISOString()
});

export const mapRowToUser = (row: any): User => ({
  id: row.id,
  orgId: row.org_id,
  email: row.email,
  fullName: row.full_name,
  role: row.role,
  departmentId: row.department_id || '',
  departmentName: row.department_name || '',
  branchId: row.branch_id || '',
  branchName: row.branch_name || '',
  twoFactorEnabled: Boolean(row.two_factor_enabled),
  avatar: row.avatar || '',
  password: row.password || undefined
});

export const mapBranchToRow = (b: Branch) => ({
  id: b.id,
  org_id: b.orgId,
  name: b.name,
  code: b.code,
  location: b.location,
  city: b.city,
  country: b.country,
  manager_name: b.managerName || '',
  updated_at: new Date().toISOString()
});

export const mapRowToBranch = (row: any): Branch => ({
  id: row.id,
  orgId: row.org_id,
  name: row.name,
  code: row.code,
  location: row.location,
  city: row.city,
  country: row.country,
  managerName: row.manager_name || ''
});

// --- Local Cache Helpers ---

const getLocal = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}:`, err);
    return fallback;
  }
};

const setLocal = <T>(key: string, val: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`Error writing localStorage key ${key}:`, err);
  }
};

// --- Core Persistence Service ---

export interface SystemDataPayload {
  assets: Asset[];
  checkouts: CheckoutRecord[];
  maintenances: MaintenanceRecord[];
  budgets: BudgetAllocation[];
  auditLogs: AuditLogItem[];
  notifications: SystemNotification[];
  users: User[];
  branches: Branch[];
  isSupabaseLive: boolean;
  lastSyncedAt: string;
}

/**
 * Load initial data on application start:
 * 1. Read local storage cache first for zero-latency UI boot.
 * 2. If Supabase is configured, fetch latest records from Supabase tables.
 * 3. Update local cache and return consolidated dataset.
 */
export async function loadInitialData(): Promise<SystemDataPayload> {
  const initialBranches: Branch[] = [...MINEAZY_BRANCHES, ...EBS_BRANCHES];

  // Baseline local cache or mock fallbacks
  let localAssets = getLocal<Asset[]>(STORAGE_KEYS.ASSETS, INITIAL_ASSETS);
  let localCheckouts = getLocal<CheckoutRecord[]>(STORAGE_KEYS.CHECKOUTS, INITIAL_CHECKOUTS);
  let localMaintenances = getLocal<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCES, INITIAL_MAINTENANCE);
  let localBudgets = getLocal<BudgetAllocation[]>(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS);
  let localAuditLogs = getLocal<AuditLogItem[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  let localNotifications = getLocal<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  let localUsers = getLocal<User[]>(STORAGE_KEYS.USERS, USERS);
  let localBranches = getLocal<Branch[]>(STORAGE_KEYS.BRANCHES, initialBranches);

  let isSupabaseLive = false;
  let lastSyncedAt = getLocal<string>(STORAGE_KEYS.LAST_SYNC, 'Local Cache');

  if (isSupabaseConfigured()) {
    try {
      console.log('Connecting to Supabase to retrieve persisted IT Asset records...');
      
      const [
        assetsRes,
        checkoutsRes,
        maintenancesRes,
        budgetsRes,
        auditLogsRes,
        notifsRes,
        usersRes,
        branchesRes
      ] = await Promise.allSettled([
        supabase.from('assets').select('*').order('created_at', { ascending: false }).limit(500),
        supabase.from('checkouts').select('*').order('checked_out_at', { ascending: false }).limit(200),
        supabase.from('maintenances').select('*').order('start_date', { ascending: false }).limit(200),
        supabase.from('budgets').select('*').limit(100),
        supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(200),
        supabase.from('notifications').select('*').order('timestamp', { ascending: false }).limit(100),
        supabase.from('users').select('*').limit(200),
        supabase.from('branches').select('*').limit(100)
      ]);

      // If at least assets or users table is accessible, consider Supabase live
      let hasSupabaseData = false;

      if (assetsRes.status === 'fulfilled' && assetsRes.value.data && assetsRes.value.data.length > 0) {
        localAssets = assetsRes.value.data.map(mapRowToAsset);
        setLocal(STORAGE_KEYS.ASSETS, localAssets);
        hasSupabaseData = true;
      }
      if (checkoutsRes.status === 'fulfilled' && checkoutsRes.value.data && checkoutsRes.value.data.length > 0) {
        localCheckouts = checkoutsRes.value.data.map(mapRowToCheckout);
        setLocal(STORAGE_KEYS.CHECKOUTS, localCheckouts);
        hasSupabaseData = true;
      }
      if (maintenancesRes.status === 'fulfilled' && maintenancesRes.value.data && maintenancesRes.value.data.length > 0) {
        localMaintenances = maintenancesRes.value.data.map(mapRowToMaintenance);
        setLocal(STORAGE_KEYS.MAINTENANCES, localMaintenances);
        hasSupabaseData = true;
      }
      if (budgetsRes.status === 'fulfilled' && budgetsRes.value.data && budgetsRes.value.data.length > 0) {
        localBudgets = budgetsRes.value.data.map(mapRowToBudget);
        setLocal(STORAGE_KEYS.BUDGETS, localBudgets);
        hasSupabaseData = true;
      }
      if (auditLogsRes.status === 'fulfilled' && auditLogsRes.value.data && auditLogsRes.value.data.length > 0) {
        localAuditLogs = auditLogsRes.value.data.map(mapRowToAudit);
        setLocal(STORAGE_KEYS.AUDIT_LOGS, localAuditLogs);
        hasSupabaseData = true;
      }
      if (notifsRes.status === 'fulfilled' && notifsRes.value.data && notifsRes.value.data.length > 0) {
        localNotifications = notifsRes.value.data.map(mapRowToNotification);
        setLocal(STORAGE_KEYS.NOTIFICATIONS, localNotifications);
        hasSupabaseData = true;
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.data && usersRes.value.data.length > 0) {
        localUsers = usersRes.value.data.map(mapRowToUser);
        setLocal(STORAGE_KEYS.USERS, localUsers);
        hasSupabaseData = true;
      }
      if (branchesRes.status === 'fulfilled' && branchesRes.value.data && branchesRes.value.data.length > 0) {
        localBranches = branchesRes.value.data.map(mapRowToBranch);
        setLocal(STORAGE_KEYS.BRANCHES, localBranches);
        hasSupabaseData = true;
      }

      // Check if connection succeeded (even if tables were empty)
      if (assetsRes.status === 'fulfilled' && !assetsRes.value.error) {
        isSupabaseLive = true;
        lastSyncedAt = new Date().toLocaleTimeString();
        setLocal(STORAGE_KEYS.LAST_SYNC, lastSyncedAt);
      } else if (hasSupabaseData) {
        isSupabaseLive = true;
        lastSyncedAt = new Date().toLocaleTimeString();
        setLocal(STORAGE_KEYS.LAST_SYNC, lastSyncedAt);
      }
    } catch (err) {
      console.warn('Supabase fetch notice, continuing with local persistent storage:', err);
    }
  }

  return {
    assets: localAssets,
    checkouts: localCheckouts,
    maintenances: localMaintenances,
    budgets: localBudgets,
    auditLogs: localAuditLogs,
    notifications: localNotifications,
    users: localUsers,
    branches: localBranches,
    isSupabaseLive,
    lastSyncedAt
  };
}

/**
 * Persist an Asset to Supabase and Local Storage.
 */
export async function persistAsset(asset: Asset, allAssets: Asset[]): Promise<boolean> {
  // Update local cache immediately
  setLocal(STORAGE_KEYS.ASSETS, allAssets);

  if (!isSupabaseConfigured()) return true;

  try {
    const row = mapAssetToRow(asset);
    const { error } = await supabase.from('assets').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase asset upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase asset network error:', err);
    return false;
  }
}

/**
 * Delete an Asset from Supabase and Local Storage.
 */
export async function deleteAssetFromDb(assetId: string, remainingAssets: Asset[]): Promise<boolean> {
  setLocal(STORAGE_KEYS.ASSETS, remainingAssets);

  if (!isSupabaseConfigured()) return true;

  try {
    const { error } = await supabase.from('assets').delete().eq('id', assetId);
    if (error) {
      console.warn('Supabase asset delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase asset delete network error:', err);
    return false;
  }
}

/**
 * Bulk persist multiple assets (e.g. from CSV import).
 */
export async function bulkPersistAssets(newAssets: Asset[], allAssets: Asset[]): Promise<boolean> {
  setLocal(STORAGE_KEYS.ASSETS, allAssets);

  if (!isSupabaseConfigured()) return true;

  try {
    const rows = newAssets.map(mapAssetToRow);
    const { error } = await supabase.from('assets').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase bulk asset error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase bulk asset network error:', err);
    return false;
  }
}

/**
 * Persist a Checkout Record and optionally the updated asset.
 */
export async function persistCheckout(
  chk: CheckoutRecord,
  allCheckouts: CheckoutRecord[],
  updatedAsset?: Asset,
  allAssets?: Asset[]
): Promise<boolean> {
  setLocal(STORAGE_KEYS.CHECKOUTS, allCheckouts);
  if (allAssets) setLocal(STORAGE_KEYS.ASSETS, allAssets);

  if (!isSupabaseConfigured()) return true;

  try {
    const chkRow = mapCheckoutToRow(chk);
    await supabase.from('checkouts').upsert(chkRow, { onConflict: 'id' });

    if (updatedAsset) {
      const assetRow = mapAssetToRow(updatedAsset);
      await supabase.from('assets').upsert(assetRow, { onConflict: 'id' });
    }

    return true;
  } catch (err) {
    console.warn('Supabase checkout error:', err);
    return false;
  }
}

/**
 * Persist a Maintenance Record and optionally the updated asset.
 */
export async function persistMaintenance(
  mnt: MaintenanceRecord,
  allMaintenances: MaintenanceRecord[],
  updatedAsset?: Asset,
  allAssets?: Asset[]
): Promise<boolean> {
  setLocal(STORAGE_KEYS.MAINTENANCES, allMaintenances);
  if (allAssets) setLocal(STORAGE_KEYS.ASSETS, allAssets);

  if (!isSupabaseConfigured()) return true;

  try {
    const mntRow = mapMaintenanceToRow(mnt);
    await supabase.from('maintenances').upsert(mntRow, { onConflict: 'id' });

    if (updatedAsset) {
      const assetRow = mapAssetToRow(updatedAsset);
      await supabase.from('assets').upsert(assetRow, { onConflict: 'id' });
    }

    return true;
  } catch (err) {
    console.warn('Supabase maintenance error:', err);
    return false;
  }
}

/**
 * Persist an Audit Log item.
 */
export async function persistAuditLog(log: AuditLogItem, allLogs: AuditLogItem[]): Promise<boolean> {
  setLocal(STORAGE_KEYS.AUDIT_LOGS, allLogs);

  if (!isSupabaseConfigured()) return true;

  try {
    const row = mapAuditToRow(log);
    await supabase.from('audit_logs').upsert(row, { onConflict: 'id' });
    return true;
  } catch (err) {
    console.warn('Supabase audit log error:', err);
    return false;
  }
}

/**
 * Persist a System Notification.
 */
export async function persistNotification(n: SystemNotification, allNotifs: SystemNotification[]): Promise<boolean> {
  setLocal(STORAGE_KEYS.NOTIFICATIONS, allNotifs);

  if (!isSupabaseConfigured()) return true;

  try {
    const row = mapNotificationToRow(n);
    await supabase.from('notifications').upsert(row, { onConflict: 'id' });
    return true;
  } catch (err) {
    console.warn('Supabase notification error:', err);
    return false;
  }
}

/**
 * Persist User accounts.
 */
export async function persistUser(user: User, allUsers: User[]): Promise<boolean> {
  setLocal(STORAGE_KEYS.USERS, allUsers);

  if (!isSupabaseConfigured()) return true;

  try {
    const row = mapUserToRow(user);
    await supabase.from('users').upsert(row, { onConflict: 'id' });
    return true;
  } catch (err) {
    console.warn('Supabase user error:', err);
    return false;
  }
}

/**
 * Persist Branch locations.
 */
export async function persistBranch(branch: Branch, allBranches: Branch[]): Promise<boolean> {
  setLocal(STORAGE_KEYS.BRANCHES, allBranches);

  if (!isSupabaseConfigured()) return true;

  try {
    const row = mapBranchToRow(branch);
    await supabase.from('branches').upsert(row, { onConflict: 'id' });
    return true;
  } catch (err) {
    console.warn('Supabase branch error:', err);
    return false;
  }
}

/**
 * Seed all baseline data directly to Supabase.
 * Useful when user provisions a brand new Supabase project and wants all assets/users instantly pushed to cloud.
 */
export async function seedBaselineToSupabase(data: {
  assets: Asset[];
  checkouts: CheckoutRecord[];
  maintenances: MaintenanceRecord[];
  budgets: BudgetAllocation[];
  auditLogs: AuditLogItem[];
  notifications: SystemNotification[];
  users: User[];
  branches: Branch[];
}): Promise<{ success: boolean; message: string; details?: any }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase credentials not detected. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings or environment.'
    };
  }

  try {
    const results: Record<string, { total: number; success: boolean; error?: string }> = {};

    // 1. Branches
    const branchRows = data.branches.map(mapBranchToRow);
    const { error: bErr } = await supabase.from('branches').upsert(branchRows, { onConflict: 'id' });
    results.branches = { total: branchRows.length, success: !bErr, error: bErr?.message };

    // 2. Users
    const userRows = data.users.map(mapUserToRow);
    const { error: uErr } = await supabase.from('users').upsert(userRows, { onConflict: 'id' });
    results.users = { total: userRows.length, success: !uErr, error: uErr?.message };

    // 3. Budgets
    const budgetRows = data.budgets.map(mapBudgetToRow);
    const { error: bgErr } = await supabase.from('budgets').upsert(budgetRows, { onConflict: 'id' });
    results.budgets = { total: budgetRows.length, success: !bgErr, error: bgErr?.message };

    // 4. Assets
    const assetRows = data.assets.map(mapAssetToRow);
    const { error: aErr } = await supabase.from('assets').upsert(assetRows, { onConflict: 'id' });
    results.assets = { total: assetRows.length, success: !aErr, error: aErr?.message };

    // 5. Checkouts
    const checkoutRows = data.checkouts.map(mapCheckoutToRow);
    const { error: cErr } = await supabase.from('checkouts').upsert(checkoutRows, { onConflict: 'id' });
    results.checkouts = { total: checkoutRows.length, success: !cErr, error: cErr?.message };

    // 6. Maintenances
    const mntRows = data.maintenances.map(mapMaintenanceToRow);
    const { error: mErr } = await supabase.from('maintenances').upsert(mntRows, { onConflict: 'id' });
    results.maintenances = { total: mntRows.length, success: !mErr, error: mErr?.message };

    // 7. Audit Logs
    const auditRows = data.auditLogs.map(mapAuditToRow);
    const { error: audErr } = await supabase.from('audit_logs').upsert(auditRows, { onConflict: 'id' });
    results.auditLogs = { total: auditRows.length, success: !audErr, error: audErr?.message };

    // 8. Notifications
    const notifRows = data.notifications.map(mapNotificationToRow);
    const { error: nErr } = await supabase.from('notifications').upsert(notifRows, { onConflict: 'id' });
    results.notifications = { total: notifRows.length, success: !nErr, error: nErr?.message };

    const anyFailed = Object.values(results).some(r => !r.success);
    if (anyFailed) {
      const failedTables = Object.entries(results)
        .filter(([_, v]) => !v.success)
        .map(([k, v]) => `${k} (${v.error || 'table missing'})`)
        .join(', ');

      return {
        success: false,
        message: `Some tables could not be populated: ${failedTables}. Please ensure you have executed the Supabase SQL schema in your Supabase SQL Editor.`,
        details: results
      };
    }

    setLocal(STORAGE_KEYS.LAST_SYNC, new Date().toLocaleTimeString());

    return {
      success: true,
      message: `Successfully seeded all ${data.assets.length} assets, ${data.branches.length} branches, and ${data.users.length} users into Supabase cloud database!`,
      details: results
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to seed data: ${err?.message || err}`
    };
  }
}

/**
 * Test connectivity to Supabase and verify which tables exist.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  tableStatus: Record<string, boolean>;
}> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase URL or Anon Key is missing. Check VITE_SUPABASE_URL in .env.example',
      tableStatus: {}
    };
  }

  const tableStatus: Record<string, boolean> = {
    assets: false,
    checkouts: false,
    maintenances: false,
    budgets: false,
    audit_logs: false,
    notifications: false,
    users: false,
    branches: false
  };

  try {
    const checks = await Promise.allSettled(
      Object.keys(tableStatus).map(async (table) => {
        const { error } = await supabase.from(table).select('id').limit(1);
        return { table, ok: !error };
      })
    );

    checks.forEach((res) => {
      if (res.status === 'fulfilled') {
        tableStatus[res.value.table] = res.value.ok;
      }
    });

    const anyTableOk = Object.values(tableStatus).some(Boolean);
    const allTablesOk = Object.values(tableStatus).every(Boolean);

    if (allTablesOk) {
      return {
        connected: true,
        message: 'All 8 Supabase database tables are active and connected with real-time replication!',
        tableStatus
      };
    } else if (anyTableOk) {
      return {
        connected: true,
        message: 'Supabase connection established, but some tables are missing. Run the Supabase SQL schema script to provision all tables.',
        tableStatus
      };
    } else {
      return {
        connected: false,
        message: 'Connected to Supabase endpoint, but tables have not been created yet. Run the SQL script in your Supabase SQL Editor.',
        tableStatus
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      message: `Connection failed: ${err?.message || err}`,
      tableStatus
    };
  }
}

/**
 * Setup Realtime change listener to sync updates across tabs / clients.
 */
export function subscribeToAllRealtimeChanges(onRefreshRequested: () => void) {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, () => onRefreshRequested())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkouts' }, () => onRefreshRequested())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenances' }, () => onRefreshRequested())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, () => onRefreshRequested())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => onRefreshRequested())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'branches' }, () => onRefreshRequested())
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime database sync active for all IT Asset tables.');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Could not establish Supabase realtime channel:', err);
    return () => {};
  }
}

/**
 * Complete SQL script for user to copy/paste into Supabase SQL Editor.
 */
export const SUPABASE_SETUP_SQL = `-- ============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR IT ASSET MANAGEMENT SYSTEM
-- Run this in your Supabase Project -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Branches Table
CREATE TABLE IF NOT EXISTS public.branches (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  manager_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER',
  department_id TEXT,
  department_name TEXT,
  branch_id TEXT,
  branch_name TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  avatar TEXT,
  password TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Budgets Table
CREATE TABLE IF NOT EXISTS public.budgets (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  department_name TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  fiscal_year INT NOT NULL,
  allocated NUMERIC(14,2) NOT NULL DEFAULT 0,
  spent NUMERIC(14,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Assets Table
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  branch_id TEXT,
  branch_name TEXT,
  category_id TEXT,
  category_name TEXT,
  category TEXT,
  asset_code TEXT NOT NULL,
  name TEXT NOT NULL,
  model TEXT,
  serial_number TEXT,
  mac_address TEXT,
  phone_number TEXT,
  registered_email TEXT,
  imei_number TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  condition TEXT NOT NULL DEFAULT 'GOOD',
  purchase_date TEXT,
  purchase_cost NUMERIC(12,2) DEFAULT 0,
  warranty_expiry TEXT,
  current_value NUMERIC(12,2) DEFAULT 0,
  assigned_to_user_id TEXT,
  assigned_to_user_name TEXT,
  assigned_at TEXT,
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Checkouts Table
CREATE TABLE IF NOT EXISTS public.checkouts (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  asset_code TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  checked_out_by TEXT NOT NULL,
  checked_out_to_user_id TEXT NOT NULL,
  checked_out_to_user_name TEXT NOT NULL,
  checked_out_at TEXT NOT NULL,
  expected_return_date TEXT,
  checked_in_at TEXT,
  return_condition TEXT,
  damage_reported BOOLEAN DEFAULT FALSE,
  damage_description TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Maintenances Table
CREATE TABLE IF NOT EXISTS public.maintenances (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  asset_code TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  priority TEXT DEFAULT 'MEDIUM',
  description TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  assigned_technician TEXT NOT NULL,
  start_date TEXT NOT NULL,
  expected_completion TEXT NOT NULL,
  actual_completion TEXT,
  cost NUMERIC(12,2) DEFAULT 0,
  parts_replaced TEXT,
  notes TEXT,
  audit_logs JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  changes TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create Open Access Policies for the client anon key
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'branches' AND policyname = 'Allow anon full access to branches') THEN
    CREATE POLICY "Allow anon full access to branches" ON public.branches FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow anon full access to users') THEN
    CREATE POLICY "Allow anon full access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'budgets' AND policyname = 'Allow anon full access to budgets') THEN
    CREATE POLICY "Allow anon full access to budgets" ON public.budgets FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assets' AND policyname = 'Allow anon full access to assets') THEN
    CREATE POLICY "Allow anon full access to assets" ON public.assets FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'checkouts' AND policyname = 'Allow anon full access to checkouts') THEN
    CREATE POLICY "Allow anon full access to checkouts" ON public.checkouts FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'maintenances' AND policyname = 'Allow anon full access to maintenances') THEN
    CREATE POLICY "Allow anon full access to maintenances" ON public.maintenances FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Allow anon full access to audit_logs') THEN
    CREATE POLICY "Allow anon full access to audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow anon full access to notifications') THEN
    CREATE POLICY "Allow anon full access to notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Enable Realtime for all tables
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.assets, public.checkouts, public.maintenances, public.budgets, public.audit_logs, public.notifications, public.users, public.branches;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
    WHEN undefined_object THEN
      NULL;
  END;
END $$;
`;
