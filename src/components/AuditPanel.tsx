import React, { useState } from 'react';
import { AuditLogItem, Organization, User, Branch } from '../types';
import { ShieldAlert, Terminal, Lock, UserCheck, ShieldCheck, UserPlus, Users, MapPin, Edit2, Save } from 'lucide-react';
import { DEPARTMENTS } from '../mockData';

interface AuditPanelProps {
  currentOrg: Organization;
  auditLogs: AuditLogItem[];
  users: User[];
  currentUser: User | null;
  branches: Branch[];
  onRegisterUser?: (newUser: User) => void;
  onClearDummyUsers?: () => void;
  onUpdateBranch?: (branchId: string, updatedFields: Partial<Branch>) => void;
  onRegisterBranch?: (newBranch: any) => void;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({
  currentOrg,
  auditLogs,
  users,
  currentUser,
  branches = [],
  onRegisterUser,
  onClearDummyUsers,
  onUpdateBranch,
  onRegisterBranch
}) => {
  const orgLogs = auditLogs.filter(a => a.orgId === currentOrg.id);
  const orgUsers = users.filter(u => u.orgId === currentOrg.id);

  const isAdmin = currentUser?.role === 'ADMIN';

  // Right-hand tab state
  const [activeRightTab, setActiveRightTab] = useState<'policy' | 'users' | 'branches'>(isAdmin ? 'users' : 'policy');

  // New Account state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'DIRECTOR' | 'BRANCH_MANAGER' | 'IT_SUPPORT' | 'FINANCE' | 'USER'>('USER');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || '');
  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0]?.id || '');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Branch creation state
  const [showCreateBranchModal, setShowCreateBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchLocation, setNewBranchLocation] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');

  // Branch editing state
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editBranchName, setEditBranchName] = useState('');
  const [editBranchCode, setEditBranchCode] = useState('');
  const [editBranchLocation, setEditBranchLocation] = useState('');
  const [editBranchCity, setEditBranchCity] = useState('');
  const [editBranchCountry, setEditBranchCountry] = useState('');
  const [editBranchManager, setEditBranchManager] = useState('');

  const handleStartEditBranch = (b: Branch) => {
    setEditingBranch(b);
    setEditBranchName(b.name);
    setEditBranchCode(b.code);
    setEditBranchLocation(b.location || '');
    setEditBranchCity(b.city || '');
    setEditBranchCountry(b.country || '');
    setEditBranchManager(b.managerName || '');
  };

  const handleSaveBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch || !onUpdateBranch) return;

    onUpdateBranch(editingBranch.id, {
      name: editBranchName.trim(),
      code: editBranchCode.trim().toUpperCase(),
      location: editBranchLocation.trim(),
      city: editBranchCity.trim(),
      country: editBranchCountry.trim(),
      managerName: editBranchManager.trim(),
    });

    setSuccessMsg(`Branch "${editBranchName}" has been successfully updated.`);
    setTimeout(() => setSuccessMsg(''), 4000);
    setEditingBranch(null);
  };

  const handleCreateBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchCode || !newBranchCity) {
      alert('Please fill out all required fields.');
      return;
    }

    const newBranch: Branch = {
      id: `br-${Date.now()}`,
      orgId: currentOrg.id,
      name: newBranchName.trim(),
      code: newBranchCode.trim().toUpperCase(),
      location: newBranchLocation.trim() || 'Main Street',
      city: newBranchCity.trim(),
      country: 'Australia',
      managerName: newBranchManager.trim() || currentUser?.fullName || 'Branch Manager'
    };

    if (onRegisterBranch) {
      onRegisterBranch(newBranch);
      setSuccessMsg(`Branch "${newBranch.name}" has been successfully registered!`);
      // Reset form
      setNewBranchName('');
      setNewBranchCode('');
      setNewBranchCity('');
      setNewBranchLocation('');
      setNewBranchManager('');
      setShowCreateBranchModal(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newPassword) {
      alert('Please fill out all required fields.');
      return;
    }

    const branch = branches.find(b => b.id === selectedBranchId) || branches[0];
    const branchId = branch ? branch.id : '';
    const branchName = branch ? branch.name : 'No Branch Assigned';
    const department = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0]!;

    const newUser: User = {
      id: `u-${Date.now()}`,
      orgId: currentOrg.id,
      email: newEmail.trim().toLowerCase(),
      fullName: newFullName.trim(),
      role: newRole,
      departmentId: department.id,
      departmentName: department.name,
      branchId: branchId,
      branchName: branchName,
      twoFactorEnabled,
      password: newPassword,
      avatar: `https://images.unsplash.com/photo-${['1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e', '1573496359142-b8d87734a5a2', '1492562080023-ab3db95bfbce'][Math.floor(Math.random() * 5)]}?w=150&auto=format&fit=crop&q=80`
    };

    if (onRegisterUser) {
      onRegisterUser(newUser);
      setSuccessMsg(`Account for ${newUser.fullName} was successfully created!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      
      // Reset Form
      setNewFullName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('USER');
      setTwoFactorEnabled(false);
      setShowCreateModal(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Real-Time Audit Stream & Security Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Immutable audit logs of all asset modifications, custody changes, and user management events.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isAdmin && (
            <button
              onClick={() => {
                setActiveRightTab('users');
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/15 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Create Staff Account</span>
            </button>
          )}

          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NextAuth 2FA Enforced</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Audit Stream */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Immutable Transaction Feed</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Table 12: AuditLog</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {orgLogs.map(log => (
              <div key={log.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-slate-800 text-teal-300 rounded border border-slate-700">{log.action}</span>
                    <span className="text-xs font-bold text-white">{log.entityName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-snug">{log.changes}</p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                  <span>Executed by: <strong className="text-slate-300">{log.userName} ({log.userRole})</strong></span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tabbed Panel (Access Control vs User Directory) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex border-b border-slate-800 mb-4 pb-1 gap-1 flex-wrap">
              <button
                onClick={() => setActiveRightTab('policy')}
                className={`pb-2.5 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeRightTab === 'policy'
                    ? 'border-teal-500 text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Access Policy
              </button>
              <button
                onClick={() => setActiveRightTab('users')}
                className={`pb-2.5 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeRightTab === 'users'
                    ? 'border-teal-500 text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Users & Accounts {`(${orgUsers.length})`}
              </button>
              <button
                onClick={() => setActiveRightTab('branches')}
                className={`pb-2.5 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeRightTab === 'branches'
                    ? 'border-teal-500 text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Branches {`(${branches.length})`}
              </button>
            </div>

            {successMsg && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
                {successMsg}
              </div>
            )}

            {activeRightTab === 'policy' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Access Control Policy</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-red-400 flex items-center justify-between"><span>ADMIN / DIRECTOR</span><UserCheck className="w-3.5 h-3.5" /></div>
                  <p className="text-[11px] text-slate-400 mt-1">Full cross-branch read/write, budget approvals, and schema updates.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-300 flex items-center justify-between"><span>BRANCH_MANAGER</span><UserCheck className="w-3.5 h-3.5" /></div>
                  <p className="text-[11px] text-slate-400 mt-1">Manage hardware, maintenance, and checkouts restricted strictly to their assigned branch.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-blue-300 flex items-center justify-between"><span>IT_SUPPORT</span><UserCheck className="w-3.5 h-3.5" /></div>
                  <p className="text-[11px] text-slate-400 mt-1">Perform checkouts, execute repair tickets, update device status across departments.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 border-l-2 border-l-teal-400">
                  <div className="font-bold text-teal-300 flex items-center justify-between"><span>ASSIGNED USER</span><Lock className="w-3.5 h-3.5" /></div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    <strong>Strict Custody Boundary:</strong> Can only view and interact with devices explicitly assigned to their UUID.
                  </p>
                </div>
              </div>
            )}

            {activeRightTab === 'users' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span>Staff Directory</span>
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {isAdmin && onClearDummyUsers && orgUsers.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to clear all dummy accounts? This will delete pre-configured demo accounts, keeping only you (Admin) and custom created staff members.')) {
                            onClearDummyUsers();
                            setSuccessMsg('Successfully cleared demo accounts.');
                            setTimeout(() => setSuccessMsg(''), 4000);
                          }
                        }}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 font-semibold rounded-lg text-[9px] transition cursor-pointer"
                        title="Clear all pre-configured demo staff accounts to start clean"
                      >
                        Purge Demo Users
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-[10px] transition flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Account</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAdmin && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-[11px] text-slate-400">
                    🔒 Account creation is restricted to Organization Admins.
                  </div>
                )}

                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {orgUsers.map(u => (
                    <div key={u.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-3.5">
                      <img src={u.avatar} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate flex items-center justify-between">
                          <span>{u.fullName}</span>
                          <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                            u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            u.role === 'DIRECTOR' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            u.role === 'BRANCH_MANAGER' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate font-mono">{u.email}</div>
                        <div className="text-[9px] text-slate-400 truncate mt-0.5">
                          {u.branchName} • <span className="font-medium text-slate-500">{u.departmentName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRightTab === 'branches' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span>Locations & Branches</span>
                  </span>
                  {isAdmin && onRegisterBranch && (
                    <button
                      onClick={() => setShowCreateBranchModal(true)}
                      className="px-2.5 py-1 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-[10px] rounded-lg shadow-sm transition uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Add Branch</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {branches.length === 0 ? (
                    <div className="text-center py-8 bg-slate-950 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                      No branches configured yet. Click "Add Branch" to create one manually.
                    </div>
                  ) : (
                    branches.map(b => (
                      <div key={b.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                            <span className="truncate">{b.name}</span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                              {b.code}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{b.location}, {b.city}</div>
                          <div className="text-[9px] text-slate-400 truncate mt-0.5">
                            Manager: <span className="font-semibold text-slate-300">{b.managerName}</span>
                          </div>
                        </div>

                        {isAdmin && onUpdateBranch && (
                          <button
                            onClick={() => handleStartEditBranch(b)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-teal-400 rounded-lg transition shrink-0 cursor-pointer"
                            title="Edit branch details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-[10px] text-slate-500">
            Secure workspace data isolation policies actively enforced.
          </div>
        </div>
      </div>

      {/* Creation Modal for Admins */}
      {showCreateModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>
            
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-1.5">
              <UserPlus className="w-5 h-5 text-teal-400" />
              <span>Create Staff Account</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Provision a new secure account with RBAC policies and automated tenancy scoping.</p>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email / Username *</label>
                <input
                  type="text"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="e.g. sarah.c@mineazy.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Security Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters recommended"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Security Role</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none font-semibold"
                  >
                    <option value="USER">User (Standard Custody)</option>
                    <option value="IT_SUPPORT">IT Support Tech</option>
                    <option value="FINANCE">Finance Auditor</option>
                    <option value="BRANCH_MANAGER">Branch Manager</option>
                    <option value="DIRECTOR">Director</option>
                    <option value="ADMIN">System Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={selectedDeptId}
                    onChange={e => setSelectedDeptId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  >
                    {DEPARTMENTS.filter(d => d.orgId === currentOrg.id).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Branch Location</label>
                <select
                  value={selectedBranchId}
                  onChange={e => setSelectedBranchId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 py-1.5">
                <input
                  type="checkbox"
                  id="2fa-check"
                  checked={twoFactorEnabled}
                  onChange={e => setTwoFactorEnabled(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500"
                />
                <label htmlFor="2fa-check" className="text-slate-300 select-none cursor-pointer">Enforce Two-Factor Authentication (2FA)</label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Registration Modal */}
      {showCreateBranchModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in duration-200">
            <button onClick={() => setShowCreateBranchModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>
            
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-1.5">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>Register New Branch Location</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Add a new operational center, regional office, or site branch to the ledger.</p>

            <form onSubmit={handleCreateBranchSubmit} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={newBranchName}
                  onChange={e => setNewBranchName(e.target.value)}
                  placeholder="e.g. Perth Downtown HQ"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Branch Code *</label>
                  <input
                    type="text"
                    required
                    value={newBranchCode}
                    onChange={e => setNewBranchCode(e.target.value)}
                    placeholder="e.g. HQ-PER"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Manager Name</label>
                  <input
                    type="text"
                    value={newBranchManager}
                    onChange={e => setNewBranchManager(e.target.value)}
                    placeholder="e.g. Marcus Thorne"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={newBranchLocation}
                  onChange={e => setNewBranchLocation(e.target.value)}
                  placeholder="e.g. St Georges Terrace"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={newBranchCity}
                  onChange={e => setNewBranchCity(e.target.value)}
                  placeholder="e.g. Perth"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateBranchModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Register Branch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Edit Modal */}
      {editingBranch && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 font-sans">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setEditingBranch(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>
            
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-1.5">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>Edit Branch Location</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Modify the configuration and identity metadata of this regional office.</p>

            <form onSubmit={handleSaveBranchSubmit} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={editBranchName}
                  onChange={e => setEditBranchName(e.target.value)}
                  placeholder="e.g. Kalgoorlie Gold Pit Alpha"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Branch Code *</label>
                  <input
                    type="text"
                    required
                    value={editBranchCode}
                    onChange={e => setEditBranchCode(e.target.value)}
                    placeholder="e.g. KGO-ALPHA"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Manager Name</label>
                  <input
                    type="text"
                    value={editBranchManager}
                    onChange={e => setEditBranchManager(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={editBranchLocation}
                  onChange={e => setEditBranchLocation(e.target.value)}
                  placeholder="e.g. 100 Mining Rd"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={editBranchCity}
                    onChange={e => setEditBranchCity(e.target.value)}
                    placeholder="e.g. Kalgoorlie"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={editBranchCountry}
                    onChange={e => setEditBranchCountry(e.target.value)}
                    placeholder="e.g. Australia"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
