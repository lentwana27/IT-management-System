import React from 'react';
import { Box, Layers, ArrowLeftRight, Wrench, PieChart, ShieldAlert, Database, Sparkles, KeyRound, BarChart3 } from 'lucide-react';
import { User } from '../types';

export type NavTab = 'dashboard' | 'assets' | 'checkout' | 'repair' | 'budget' | 'audit' | 'reports';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  assetCount: number;
  repairCount: number;
  currentUser?: User | null;
  isSupabaseLive?: boolean;
  onOpenSupabaseModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  assetCount,
  repairCount,
  currentUser,
  isSupabaseLive = false,
  onOpenSupabaseModal
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number | string; highlight?: boolean }[] = [
    { id: 'dashboard', label: '3D Dashboard', icon: <Box className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" />, highlight: true },
    { id: 'assets', label: 'Asset Tracking', icon: <Layers className="w-4 h-4" />, badge: assetCount },
    { id: 'checkout', label: 'Checkout / In', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'repair', label: 'Maintenance Panel', icon: <Wrench className="w-4 h-4" />, badge: repairCount > 0 ? repairCount : undefined },
    { id: 'budget', label: 'Budget & Deprec.', icon: <PieChart className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Logs & Roles', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  let filteredItems = navItems;
  if (currentUser) {
    if (currentUser.role === 'ADMIN') {
      filteredItems = navItems; // Sees all tabs
    } else if (currentUser.role === 'DIRECTOR') {
      filteredItems = navItems.filter(item => ['dashboard', 'reports', 'budget', 'audit'].includes(item.id));
    } else if (currentUser.role === 'FINANCE') {
      filteredItems = navItems.filter(item => ['dashboard', 'reports', 'budget'].includes(item.id));
    } else if (currentUser.role === 'IT_SUPPORT') {
      filteredItems = navItems.filter(item => ['dashboard', 'assets', 'checkout', 'repair', 'audit'].includes(item.id));
    } else if (currentUser.role === 'BRANCH_MANAGER') {
      filteredItems = navItems.filter(item => ['dashboard', 'assets', 'checkout', 'repair', 'budget'].includes(item.id));
    } else if (currentUser.role === 'USER') {
      filteredItems = navItems.filter(item => ['dashboard', 'assets', 'checkout', 'repair'].includes(item.id));
    }
  }

  return (
    <aside className="w-full md:w-64 bg-slate-900/95 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-y-auto">
      <div className="flex md:flex-col space-x-1 md:space-x-0 md:space-y-1.5 w-full">
        <div className="hidden md:block px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-slate-500">
          Main Navigation
        </div>

        {filteredItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/20'
                    : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : item.highlight
                    ? 'bg-gradient-to-r from-teal-500/10 to-indigo-500/10 hover:from-teal-500/20 hover:to-indigo-500/20 text-teal-300 border border-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`${isActive ? 'text-teal-300' : item.highlight ? 'text-teal-400' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
                {item.highlight && <Sparkles className="w-3 h-3 text-amber-300 animate-pulse ml-1" />}
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 ${
                  isActive ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onOpenSupabaseModal}
        className="hidden md:block mt-6 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 text-left transition w-full group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-300 text-xs font-bold">
            <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-400 animate-ping' : 'bg-teal-400'}`} />
            <span>{isSupabaseLive ? 'Supabase Live' : 'Supabase Storage'}</span>
          </div>
          <span className="text-[10px] text-teal-400 group-hover:text-teal-300 font-semibold">&rarr;</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
          {isSupabaseLive
            ? 'PostgreSQL cloud database connected with real-time sync.'
            : 'Offline-first cache active. Click to manage cloud database.'}
        </p>
      </button>
    </aside>
  );
};
