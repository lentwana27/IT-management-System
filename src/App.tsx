import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard3D } from './components/Dashboard3D';
import { AssetManager } from './components/AssetManager';
import { CheckoutPanel } from './components/CheckoutPanel';
import { MaintenancePanel } from './components/MaintenancePanel';
import { BudgetPanel } from './components/BudgetPanel';
import { AuditPanel } from './components/AuditPanel';
import { SchemaDeliverable } from './components/SchemaDeliverable';
import { AuthPhase2Panel } from './components/auth/AuthPhase2Panel';
import { ReportsPanel } from './components/ReportsPanel';
import { LoginPortal } from './components/auth/LoginPortal';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import {
  loadInitialData,
  persistAsset,
  deleteAssetFromDb,
  bulkPersistAssets,
  persistCheckout,
  persistMaintenance,
  persistAuditLog,
  persistNotification,
  persistUser,
  persistBranch,
  subscribeToAllRealtimeChanges
} from './lib/supabase-storage';
import { isSupabaseConfigured } from './lib/supabase-client';

import {
  ORGANIZATIONS,
  MINEAZY_BRANCHES,
  EBS_BRANCHES,
  CATEGORIES,
  USERS,
  INITIAL_ASSETS,
  INITIAL_CHECKOUTS,
  INITIAL_MAINTENANCE,
  INITIAL_BUDGETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from './mockData';

import { Organization, User, Branch, Asset, CheckoutRecord, MaintenanceRecord, BudgetAllocation, AuditLogItem, SystemNotification } from './types';

export default function App() {
  // Dynamic Stateful Users & Branches lists for real-time registration sync!
  const [systemUsers, setSystemUsers] = useState<User[]>(USERS);
  const [systemBranches, setSystemBranches] = useState<any[]>([...MINEAZY_BRANCHES, ...EBS_BRANCHES]);

  // Tenancy & Active User State
  const [currentOrg, setCurrentOrg] = useState<Organization>(ORGANIZATIONS[0]!);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [initialAssetStatusFilter, setInitialAssetStatusFilter] = useState<string>('ALL');

  const handleLoginSuccess = (user: User, org: Organization) => {
    setCurrentOrg(org);
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  // Application Data State
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [checkouts, setCheckouts] = useState<CheckoutRecord[]>(INITIAL_CHECKOUTS);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE);
  const [budgets, setBudgets] = useState<BudgetAllocation[]>(INITIAL_BUDGETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  // Supabase Persistence & Cloud Sync State
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Local Cache');
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);

  // Load persisted data on mount (from local cache and Supabase tables)
  const refreshAppData = async () => {
    try {
      const data = await loadInitialData();
      setAssets(data.assets);
      setCheckouts(data.checkouts);
      setMaintenances(data.maintenances);
      setBudgets(data.budgets);
      setAuditLogs(data.auditLogs);
      setNotifications(data.notifications);
      setSystemUsers(data.users);
      setSystemBranches(data.branches);
      setIsSupabaseLive(data.isSupabaseLive);
      setLastSyncedAt(data.lastSyncedAt);
    } catch (err) {
      console.warn('Initial data load notice:', err);
    }
  };

  useEffect(() => {
    refreshAppData();

    // Subscribe to real-time changes across database tables
    const unsubscribe = subscribeToAllRealtimeChanges(() => {
      refreshAppData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle tenant switch
  const handleSelectOrg = (org: Organization) => {
    setCurrentOrg(org);
    const firstOrgUser = systemUsers.find(u => u.orgId === org.id) || systemUsers[0]!;
    setCurrentUser(firstOrgUser);
  };

  // Handle dynamically registered branch
  const handleRegisterBranch = (newBranch: any) => {
    const updatedBranches = [...systemBranches, newBranch];
    setSystemBranches(updatedBranches);
    persistBranch(newBranch, updatedBranches);
    
    // Log audit trail
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      orgId: currentOrg.id,
      userName: currentUser ? currentUser.fullName : 'System Admin',
      userRole: currentUser ? currentUser.role : 'ADMIN',
      action: 'APPROVE_USERS',
      entityType: 'User',
      entityName: newBranch.name,
      changes: `Registered new branch location: ${newBranch.name} (${newBranch.code}) in ${newBranch.city}`,
      timestamp: 'Just now',
      ipAddress: '10.12.84.19'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    persistAuditLog(newLog, updatedLogs);

    // Add alert
    const newAlert: SystemNotification = {
      id: `notif-${Date.now()}`,
      orgId: currentOrg.id,
      type: 'ALERT',
      title: 'New Branch Registered',
      message: `Branch ${newBranch.name} (${newBranch.code}) has been successfully provisioned.`,
      timestamp: 'Just now',
      read: false
    };
    const updatedNotifs = [newAlert, ...notifications];
    setNotifications(updatedNotifs);
    persistNotification(newAlert, updatedNotifs);
  };

  // Handle dynamically registered user
  const handleRegisterUser = (newUser: User) => {
    const updatedUsers = [...systemUsers, newUser];
    setSystemUsers(updatedUsers);
    persistUser(newUser, updatedUsers);

    // Log audit trail
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      orgId: currentOrg.id,
      userName: currentUser ? currentUser.fullName : 'System Admin',
      userRole: currentUser ? currentUser.role : 'ADMIN',
      action: 'APPROVE_USERS',
      entityType: 'User',
      entityName: newUser.fullName,
      changes: `Approved & registered active user: ${newUser.fullName} with role ${newUser.role}`,
      timestamp: 'Just now',
      ipAddress: '10.12.84.19'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    persistAuditLog(newLog, updatedLogs);

    // Add alert
    const newAlert: SystemNotification = {
      id: `notif-${Date.now()}`,
      orgId: currentOrg.id,
      type: 'ALERT',
      title: 'User Account Provisioned',
      message: `${newUser.fullName} (${newUser.role}) successfully registered for branch ${newUser.branchName}.`,
      timestamp: 'Just now',
      read: false
    };
    const updatedNotifs = [newAlert, ...notifications];
    setNotifications(updatedNotifs);
    persistNotification(newAlert, updatedNotifs);
  };

  const handleClearDummyUsers = () => {
    const filteredUsers = systemUsers.filter(u => 
      u.email === 'vision@mineazy.com' || 
      u.id === currentUser?.id || 
      u.password !== undefined || 
      !['u-admin', 'u-dir', 'u-mgr', 'u-it', 'u-fin', 'u-user1', 'ebs-admin', 'ebs-support'].includes(u.id)
    );
    setSystemUsers(filteredUsers);

    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      orgId: currentOrg.id,
      userName: currentUser ? currentUser.fullName : 'System Admin',
      userRole: currentUser ? currentUser.role : 'ADMIN',
      action: 'APPROVE_USERS',
      entityType: 'User',
      entityName: 'All Dummy Accounts',
      changes: 'Cleared all dummy pre-configured staff accounts to prepare system for live production use.',
      timestamp: 'Just now',
      ipAddress: '10.12.84.19'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    persistAuditLog(newLog, updatedLogs);
  };

  const handleUpdateBranch = (branchId: string, updatedFields: Partial<Branch>) => {
    let targetUpdatedBranch: Branch | undefined;
    const updatedBranches = systemBranches.map(b => {
      if (b.id === branchId) {
        targetUpdatedBranch = { ...b, ...updatedFields };
        return targetUpdatedBranch;
      }
      return b;
    });
    setSystemBranches(updatedBranches);
    if (targetUpdatedBranch) {
      persistBranch(targetUpdatedBranch, updatedBranches);
    }

    if (updatedFields.name) {
      const oldBranch = systemBranches.find(b => b.id === branchId);
      const oldName = oldBranch ? oldBranch.name : '';
      const newName = updatedFields.name;

      setSystemUsers(prev => prev.map(u => u.branchId === branchId ? { ...u, branchName: newName } : u));
      setAssets(prev => prev.map(a => a.branchId === branchId ? { ...a, branchName: newName } : a));

      if (currentUser && currentUser.branchId === branchId) {
        setCurrentUser(prev => prev ? { ...prev, branchName: newName } : null);
      }

      const newLog: AuditLogItem = {
        id: `aud-${Date.now()}`,
        orgId: currentOrg.id,
        userName: currentUser ? currentUser.fullName : 'System Admin',
        userRole: currentUser ? currentUser.role : 'ADMIN',
        action: 'CREATE_ASSET',
        entityType: 'Asset',
        entityName: newName,
        changes: `Renamed branch location from "${oldName}" to "${newName}"`,
        timestamp: 'Just now',
        ipAddress: '10.12.84.19'
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      persistAuditLog(newLog, updatedLogs);
    }
  };

  // Handle Add New Asset
  const handleAddAsset = (newAst: Asset) => {
    const updatedAssets = [newAst, ...assets];
    setAssets(updatedAssets);
    persistAsset(newAst, updatedAssets);

    // Log audit
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      orgId: currentOrg.id,
      userName: currentUser ? currentUser.fullName : 'System Admin',
      userRole: currentUser ? currentUser.role : 'ADMIN',
      action: 'CREATE_ASSET',
      entityType: 'Asset',
      entityName: `${newAst.assetCode} (${newAst.name})`,
      changes: `Registered new device Val: $${newAst.purchaseCost}`,
      timestamp: 'Just now',
      ipAddress: '10.12.84.19'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    persistAuditLog(newLog, updatedLogs);

    // Add alert
    const newAlert: SystemNotification = {
      id: `notif-${Date.now()}`,
      orgId: currentOrg.id,
      type: 'ALERT',
      title: 'New Hardware Asset Registered',
      message: `${newAst.name} (${newAst.assetCode}) added to ${newAst.branchName}.`,
      timestamp: 'Just now',
      read: false
    };
    const updatedNotifs = [newAlert, ...notifications];
    setNotifications(updatedNotifs);
    persistNotification(newAlert, updatedNotifs);
  };

  // Handle Update Asset
  const handleUpdateAsset = (updatedAst: Asset) => {
    const updatedAssets = assets.map(a => a.id === updatedAst.id ? updatedAst : a);
    setAssets(updatedAssets);
    persistAsset(updatedAst, updatedAssets);
  };

  // Handle Delete Asset
  const handleDeleteAsset = (astId: string) => {
    const remainingAssets = assets.filter(a => a.id !== astId);
    setAssets(remainingAssets);
    deleteAssetFromDb(astId, remainingAssets);
  };

  // Handle Bulk Upload Assets
  const handleBulkAddAssets = (newAssets: Asset[]) => {
    const updatedAssets = [...newAssets, ...assets];
    setAssets(updatedAssets);
    bulkPersistAssets(newAssets, updatedAssets);
  };

  // Handle Checkout Assignment
  const handleNewCheckout = (chk: CheckoutRecord, updatedAsset?: Asset) => {
    const updatedCheckouts = [chk, ...checkouts];
    setCheckouts(updatedCheckouts);

    let updatedAssetsList = assets;
    let targetAsset = updatedAsset;
    if (targetAsset) {
      updatedAssetsList = assets.map(a => a.id === targetAsset!.id ? targetAsset! : a);
      setAssets(updatedAssetsList);
    } else {
      updatedAssetsList = assets.map(a => {
        if (a.id === chk.assetId) {
          targetAsset = { ...a, assignedToUserId: chk.checkedOutToUserId, assignedToUserName: chk.checkedOutToUserName, assignedAt: chk.checkedOutAt };
          return targetAsset;
        }
        return a;
      });
      setAssets(updatedAssetsList);
    }

    persistCheckout(chk, updatedCheckouts, targetAsset, updatedAssetsList);
    
    // Log audit
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      orgId: currentOrg.id,
      userName: currentUser ? currentUser.fullName : 'System Admin',
      userRole: currentUser ? currentUser.role : 'ADMIN',
      action: 'CHECKOUT_ASSET',
      entityType: 'Checkout',
      entityName: chk.assetCode,
      changes: `Assigned custody to ${chk.checkedOutToUserName}`,
      timestamp: 'Just now',
      ipAddress: '10.12.84.19'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    persistAuditLog(newLog, updatedLogs);
  };

  // Handle Return Check-in
  const handleReturnAsset = (chkId: string, cond: string) => {
    const chk = checkouts.find(c => c.id === chkId);
    if (!chk) return;
    const nowIso = new Date().toISOString().split('T')[0]!;
    const updatedChk: CheckoutRecord = {
      ...chk,
      status: 'RETURNED',
      checkedInAt: nowIso,
      returnCondition: cond,
      notes: `Returned in condition: ${cond}`
    };
    const updatedCheckouts = checkouts.map(c => c.id === chkId ? updatedChk : c);
    setCheckouts(updatedCheckouts);

    const assetToRelease = assets.find(a => a.id === chk.assetId);
    let releasedAsset: Asset | undefined;
    let updatedAssetsList = assets;
    if (assetToRelease) {
      releasedAsset = {
        ...assetToRelease,
        assignedToUserId: undefined,
        assignedToUserName: undefined,
        assignedAt: undefined
      };
      updatedAssetsList = assets.map(a => a.id === chk.assetId ? releasedAsset! : a);
      setAssets(updatedAssetsList);
    }

    persistCheckout(updatedChk, updatedCheckouts, releasedAsset, updatedAssetsList);
  };

  // Handle Repair ticket
  const handleReportIssue = (mnt: MaintenanceRecord) => {
    const updatedMaintenances = [mnt, ...maintenances];
    setMaintenances(updatedMaintenances);

    const asset = assets.find(a => a.id === mnt.assetId);
    let updatedAsset: Asset | undefined;
    let updatedAssetsList = assets;
    if (asset) {
      updatedAsset = { ...asset, status: 'REPAIR' };
      updatedAssetsList = assets.map(a => a.id === mnt.assetId ? updatedAsset! : a);
      setAssets(updatedAssetsList);
    }

    persistMaintenance(mnt, updatedMaintenances, updatedAsset, updatedAssetsList);
  };

  // Handle Repair complete
  const handleCompleteRepair = (mntId: string) => {
    const mnt = maintenances.find(m => m.id === mntId);
    if (!mnt) return;
    const updatedMnt: MaintenanceRecord = {
      ...mnt,
      status: 'COMPLETED',
      actualCompletion: new Date().toISOString().split('T')[0]!
    };
    const updatedMaintenances = maintenances.map(m => m.id === mntId ? updatedMnt : m);
    setMaintenances(updatedMaintenances);

    const asset = assets.find(a => a.id === mnt.assetId);
    let updatedAsset: Asset | undefined;
    let updatedAssetsList = assets;
    if (asset) {
      updatedAsset = { ...asset, status: 'ACTIVE' };
      updatedAssetsList = assets.map(a => a.id === mnt.assetId ? updatedAsset! : a);
      setAssets(updatedAssetsList);
    }

    persistMaintenance(updatedMnt, updatedMaintenances, updatedAsset, updatedAssetsList);
  };

  const handleUpdateTicket = (updatedRecord: MaintenanceRecord) => {
    const updatedMaintenances = maintenances.map(m => m.id === updatedRecord.id ? updatedRecord : m);
    setMaintenances(updatedMaintenances);

    let updatedAsset: Asset | undefined;
    let updatedAssetsList = assets;
    if (updatedRecord.status === 'COMPLETED') {
      const asset = assets.find(a => a.id === updatedRecord.assetId);
      if (asset) {
        updatedAsset = { ...asset, status: 'ACTIVE' };
        updatedAssetsList = assets.map(a => a.id === updatedRecord.assetId ? updatedAsset! : a);
        setAssets(updatedAssetsList);
      }
    }

    persistMaintenance(updatedRecord, updatedMaintenances, updatedAsset, updatedAssetsList);
  };

  if (!currentUser) {
    return (
      <LoginPortal
        organizations={ORGANIZATIONS}
        users={systemUsers}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Branch multi-tenant and role-based filtering rules
  const isBranchRestricted = currentUser.role === 'BRANCH_MANAGER' || currentUser.role === 'USER';

  const filteredAssets = assets.filter(a => {
    if (a.orgId !== currentOrg.id) return false;
    if (isBranchRestricted) {
      return a.branchId === currentUser.branchId;
    }
    return true;
  });

  const filteredCheckouts = checkouts.filter(c => {
    const asset = assets.find(a => a.id === c.assetId);
    if (!asset || asset.orgId !== currentOrg.id) return false;
    if (isBranchRestricted) {
      return asset.branchId === currentUser.branchId;
    }
    return true;
  });

  const filteredMaintenances = maintenances.filter(m => {
    const asset = assets.find(a => a.id === m.assetId);
    if (!asset || asset.orgId !== currentOrg.id) return false;
    if (isBranchRestricted) {
      return asset.branchId === currentUser.branchId;
    }
    return true;
  });

  const filteredBudgets = budgets.filter(b => {
    if (b.orgId !== currentOrg.id) return false;
    if (isBranchRestricted) {
      return b.branchName.toLowerCase() === currentUser.branchName.toLowerCase() || b.branchName.includes(currentUser.branchName);
    }
    return true;
  });

  const filteredNotifications = notifications.filter(n => {
    if (n.orgId !== currentOrg.id) return false;
    if (isBranchRestricted) {
      return n.message.includes(currentUser.branchName) || n.title.includes(currentUser.branchName) || !n.message.includes('Branch');
    }
    return true;
  });

  // Current org branches
  const currBranches = systemBranches.filter(b => b.orgId === currentOrg.id);
  const orgAssetsCount = filteredAssets.length;
  const orgRepairsCount = filteredMaintenances.filter(m => m.status === 'IN_PROGRESS').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        organizations={ORGANIZATIONS}
        currentOrg={currentOrg}
        onSelectOrg={handleSelectOrg}
        users={systemUsers}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        notifications={filteredNotifications}
        onMarkNotificationsRead={() => setNotifications(prev => prev.map(n => n.orgId === currentOrg.id ? { ...n, read: true } : n))}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUpdateUser={(updatedUser) => {
          setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
          setCurrentUser(updatedUser);
        }}
        isSupabaseLive={isSupabaseLive}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
      />

      {/* Main Container: Sidebar + Viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'assets') {
              setInitialAssetStatusFilter('ALL');
            }
          }}
          assetCount={orgAssetsCount}
          repairCount={orgRepairsCount}
          currentUser={currentUser}
          isSupabaseLive={isSupabaseLive}
          onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950 p-2 md:p-6 pb-20 md:pb-8">
          {activeTab === 'dashboard' && (
            <Dashboard3D
              currentOrg={currentOrg}
              assets={filteredAssets}
              maintenances={filteredMaintenances}
              budgets={filteredBudgets}
              currentUser={currentUser}
              onNavigateToAssets={(status) => {
                setInitialAssetStatusFilter(status);
                setActiveTab('assets');
              }}
            />
          )}

          {activeTab === 'auth_phase2' && (
            <AuthPhase2Panel
              organizations={ORGANIZATIONS}
              currentOrg={currentOrg}
              currentUser={currentUser}
              onUserSwitch={setCurrentUser}
              users={systemUsers}
              branches={systemBranches}
              onRegisterUser={handleRegisterUser}
              onRegisterBranch={handleRegisterBranch}
            />
          )}

          {activeTab === 'assets' && (
            <AssetManager
              currentOrg={currentOrg}
              branches={currBranches}
              categories={CATEGORIES}
              assets={filteredAssets}
              currentUser={currentUser}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
              onBulkAddAssets={handleBulkAddAssets}
              onRegisterBranch={handleRegisterBranch}
              searchQuery={searchQuery}
              initialStatusFilter={initialAssetStatusFilter}
            />
          )}

          {activeTab === 'checkout' && (
            <CheckoutPanel
              checkouts={filteredCheckouts}
              assets={filteredAssets}
              users={systemUsers.filter(u => u.orgId === currentOrg.id)}
              currentUser={currentUser}
              branches={currBranches}
              onNewCheckout={handleNewCheckout}
              onReturnAsset={handleReturnAsset}
            />
          )}

          {activeTab === 'repair' && (
            <MaintenancePanel
              maintenances={filteredMaintenances}
              assets={filteredAssets}
              users={systemUsers.filter(u => u.orgId === currentOrg.id)}
              currentUser={currentUser}
              onReportIssue={handleReportIssue}
              onUpdateTicket={handleUpdateTicket}
              onCompleteRepair={handleCompleteRepair}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetPanel
              currentOrg={currentOrg}
              budgets={filteredBudgets}
            />
          )}

          {activeTab === 'audit' && (
            <AuditPanel
              currentOrg={currentOrg}
              currentUser={currentUser}
              branches={currBranches}
              auditLogs={auditLogs.filter(log => {
                if (log.orgId !== currentOrg.id) return false;
                if (isBranchRestricted) {
                  return log.entityName.includes(currentUser.branchName) || log.changes.includes(currentUser.branchName) || log.userName === currentUser.fullName;
                }
                return true;
              })}
              users={systemUsers.filter(u => u.orgId === currentOrg.id)}
              onRegisterUser={handleRegisterUser}
              onClearDummyUsers={handleClearDummyUsers}
              onUpdateBranch={handleUpdateBranch}
              onRegisterBranch={handleRegisterBranch}
            />
          )}

          {activeTab === 'schema' && (
            <SchemaDeliverable />
          )}

          {activeTab === 'reports' && (
            <ReportsPanel
              assets={filteredAssets}
              maintenances={filteredMaintenances}
              budgets={filteredBudgets}
            />
          )}
        </main>
      </div>

      {/* Supabase Cloud Database Connection & Seeding Modal */}
      {showSupabaseModal && (
        <SupabaseSyncModal
          isOpen={showSupabaseModal}
          onClose={() => setShowSupabaseModal(false)}
          assets={assets}
          checkouts={checkouts}
          maintenances={maintenances}
          budgets={budgets}
          auditLogs={auditLogs}
          notifications={notifications}
          users={systemUsers}
          branches={systemBranches}
          lastSyncedAt={lastSyncedAt}
          isLiveConnected={isSupabaseLive}
          onDataRefresh={refreshAppData}
          onDataImported={refreshAppData}
        />
      )}
    </div>
  );
}
