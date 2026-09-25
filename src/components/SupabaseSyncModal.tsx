import React, { useState } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  UploadCloud,
  ExternalLink,
  X,
  Layers,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { getSupabaseConfig, isSupabaseConfigured } from '../lib/supabase-client';
import {
  testSupabaseConnection,
  seedBaselineToSupabase,
  SUPABASE_SETUP_SQL
} from '../lib/supabase-storage';
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

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  checkouts: CheckoutRecord[];
  maintenances: MaintenanceRecord[];
  budgets: BudgetAllocation[];
  auditLogs: AuditLogItem[];
  notifications: SystemNotification[];
  users: User[];
  branches: Branch[];
  lastSyncedAt?: string;
  isLiveConnected?: boolean;
  onDataRefresh?: () => void;
  onDataImported?: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  assets,
  checkouts,
  maintenances,
  budgets,
  auditLogs,
  notifications,
  users,
  branches,
  lastSyncedAt = 'Local Cache',
  isLiveConnected = false,
  onDataRefresh,
  onDataImported
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'guide'>('status');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
    tableStatus: Record<string, boolean>;
  } | null>(null);

  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const config = getSupabaseConfig();
  const configured = isSupabaseConfigured();

  const handleCopySql = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
      } else {
        const ta = document.createElement('textarea');
        ta.value = SUPABASE_SETUP_SQL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult({
        tested: true,
        connected: res.connected,
        message: res.message,
        tableStatus: res.tableStatus
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedBaselineToSupabase({
        assets,
        checkouts,
        maintenances,
        budgets,
        auditLogs,
        notifications,
        users,
        branches
      });
      setSeedResult(res);
      if (res.success) {
        onDataRefresh?.();
        onDataImported?.();
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Supabase Cloud Persistence</h3>
                {isLiveConnected ? (
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Synced</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    Offline-First Local Cache
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-tenant PostgreSQL backend storage, real-time replication &amp; data persistence.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'status'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sync &amp; Tables Status
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'sql'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Database Schema SQL (Ready to Run)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Setup Guide
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300 flex-1">
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Connection Status Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Cloud className={`w-4 h-4 ${isLiveConnected ? 'text-emerald-400' : 'text-blue-400'}`} />
                    <span className="font-bold text-white text-sm">
                      {isLiveConnected ? 'Connected to Supabase Project' : 'Resilient Local Storage Active'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {configured
                      ? `Target Project Host: ${config.projectHost || config.url}`
                      : 'No external Supabase credentials active yet. All changes are securely cached in local storage until keys are configured.'}
                  </p>
                  <p className="text-slate-500 text-[10px]">Last Sync Check: {lastSyncedAt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    onClick={handleSeedData}
                    disabled={isSeeding || !configured}
                    title={!configured ? 'Configure VITE_SUPABASE_URL first' : 'Push all current local items to Supabase'}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition disabled:opacity-40"
                  >
                    <UploadCloud className={`w-3.5 h-3.5 ${isSeeding ? 'animate-bounce' : ''}`} />
                    <span>{isSeeding ? 'Seeding...' : 'Seed Data to Cloud'}</span>
                  </button>
                </div>
              </div>

              {/* Action message notices */}
              {testResult && (
                <div
                  className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                    testResult.connected
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
                >
                  {testResult.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{testResult.message}</p>
                    {testResult.tableStatus && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mt-2">
                        {Object.entries(testResult.tableStatus).map(([tbl, ok]) => (
                          <div
                            key={tbl}
                            className={`px-2 py-1 rounded text-[10px] font-mono flex items-center justify-between ${
                              ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            <span>{tbl}</span>
                            <span>{ok ? '✓' : '✗'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {seedResult && (
                <div
                  className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                    seedResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
                >
                  {seedResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{seedResult.message}</p>
                  </div>
                </div>
              )}

              {/* Data Entities Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Entities Managed in Ledger ({assets.length + checkouts.length + maintenances.length + budgets.length + users.length + branches.length} Total Records)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Assets</span>
                    <span className="text-base font-bold text-white">{assets.length}</span>
                    <span className="text-[10px] text-teal-400 block">Table: assets</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Checkouts</span>
                    <span className="text-base font-bold text-white">{checkouts.length}</span>
                    <span className="text-[10px] text-indigo-400 block">Table: checkouts</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Maintenance</span>
                    <span className="text-base font-bold text-white">{maintenances.length}</span>
                    <span className="text-[10px] text-amber-400 block">Table: maintenances</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Staff Users</span>
                    <span className="text-base font-bold text-white">{users.length}</span>
                    <span className="text-[10px] text-purple-400 block">Table: users</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Branches</span>
                    <span className="text-base font-bold text-white">{branches.length}</span>
                    <span className="text-[10px] text-blue-400 block">Table: branches</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Budgets</span>
                    <span className="text-base font-bold text-white">{budgets.length}</span>
                    <span className="text-[10px] text-emerald-400 block">Table: budgets</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Audit Logs</span>
                    <span className="text-base font-bold text-white">{auditLogs.length}</span>
                    <span className="text-[10px] text-slate-400 block">Table: audit_logs</span>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[11px]">Notifications</span>
                    <span className="text-base font-bold text-white">{notifications.length}</span>
                    <span className="text-[10px] text-slate-400 block">Table: notifications</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Supabase PostgreSQL DDL Script</h4>
                  <p className="text-slate-400 text-[11px]">
                    Create all 8 required tables, RLS security policies, and enable Realtime replication.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg transition"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 max-h-96 overflow-y-auto leading-relaxed">
                <pre>{SUPABASE_SETUP_SQL}</pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>How to link your Supabase Project</span>
              </h4>

              <ol className="space-y-3 list-decimal list-inside text-slate-300 text-xs">
                <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-white">Create a Supabase Project:</strong> Go to{' '}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-400 underline inline-flex items-center gap-1"
                  >
                    supabase.com/dashboard <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and click &ldquo;New project&rdquo;.
                </li>
                <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-white">Execute the SQL Schema:</strong> Go to the &ldquo;SQL Editor&rdquo; tab on your Supabase dashboard, paste the SQL from the &ldquo;Database Schema SQL&rdquo; tab above, and click &ldquo;Run&rdquo;.
                </li>
                <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-white">Copy API Credentials:</strong> In your Supabase dashboard, navigate to{' '}
                  <span className="text-white font-mono">Project Settings &rarr; API</span>. Copy your &ldquo;Project URL&rdquo; and &ldquo;anon / public&rdquo; key.
                </li>
                <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-white">Configure Environment:</strong> Set{' '}
                  <code className="text-teal-300 font-mono">VITE_SUPABASE_URL</code> and{' '}
                  <code className="text-teal-300 font-mono">VITE_SUPABASE_ANON_KEY</code> in your environment or secrets.
                </li>
                <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-white">Seed Existing Assets:</strong> Open this panel and click &ldquo;Seed Data to Cloud&rdquo; to populate your Supabase database with all existing hardware assets, staff accounts, and branches!
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Dual-layer storage: Zero-loss offline-first caching + Supabase Cloud</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
