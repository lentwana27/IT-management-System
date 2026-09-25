import React, { useState } from 'react';
import { Organization, User, SystemNotification } from '../types';
import { Building2, ShieldCheck, Bell, Search, UserCheck, ChevronDown, CheckCircle2, AlertTriangle, Info, Clock, Database, Cloud } from 'lucide-react';

interface NavbarProps {
  organizations: Organization[];
  currentOrg: Organization;
  onSelectOrg: (org: Organization) => void;
  users: User[];
  currentUser: User | null;
  onSelectUser: (user: User | null) => void;
  notifications: SystemNotification[];
  onMarkNotificationsRead: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUpdateUser?: (user: User) => void;
  isSupabaseLive?: boolean;
  onOpenSupabaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  organizations,
  currentOrg,
  onSelectOrg,
  users,
  currentUser,
  onSelectUser,
  notifications,
  onMarkNotificationsRead,
  searchQuery,
  onSearchChange,
  onUpdateUser,
  isSupabaseLive = false,
  onOpenSupabaseModal
}) => {
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => !n.read).length;
  const orgUsers = users.filter(u => u.orgId === currentOrg.id);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'DIRECTOR': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'BRANCH_MANAGER': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'IT_SUPPORT': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'FINANCE': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between z-30 sticky top-0 shadow-lg">
      {/* Left: Branding & Static Name */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div>
            <span className="text-xs font-semibold tracking-wider text-teal-400 uppercase block">Enterprise Workspace</span>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none truncate max-w-[200px]">
              MinEazy Resources
            </h1>
          </div>
        </div>
      </div>

      {/* Middle: Universal Asset Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${currentOrg.name} laptops, serials, staff...`}
            className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-teal-500 focus:outline-none rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 transition-all"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white">✕</button>
          )}
        </div>
      </div>

      {/* Right: Notifications & Role Tester */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Supabase Cloud Database Status Pill */}
        <button
          onClick={onOpenSupabaseModal}
          title="Click to view Supabase Cloud Database sync and status"
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isSupabaseLive
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-slate-800/90 hover:bg-slate-700 text-teal-300 border-slate-700'
          }`}
        >
          <Database className={`w-3.5 h-3.5 ${isSupabaseLive ? 'text-emerald-400' : 'text-teal-400'}`} />
          <span className="hidden sm:inline">{isSupabaseLive ? 'Supabase Live' : 'Supabase Sync'}</span>
          {isSupabaseLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifMenu(!showNotifMenu); setShowOrgMenu(false); setShowUserMenu(false); }}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 bg-slate-900/80 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-white">System Alerts</span>
                </div>
                {unreadCount > 0 && (
                  <button onClick={onMarkNotificationsRead} className="text-[11px] text-teal-400 hover:underline font-medium">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No alerts found.</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`p-3.5 transition-colors ${!notif.read ? 'bg-slate-750/60 border-l-2 border-teal-500' : 'opacity-70'}`}>
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {notif.type === 'WARRANTY' && <Clock className="w-4 h-4 text-amber-400" />}
                          {notif.type === 'MAINTENANCE' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                          {notif.type === 'ALERT' && <Info className="w-4 h-4 text-blue-400" />}
                          {notif.type === 'ASSIGNMENT' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-white">{notif.title}</div>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher Simulator */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowOrgMenu(false); setShowNotifMenu(false); }}
            className="flex items-center space-x-2.5 p-1.5 md:px-3 md:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/90 border border-slate-700 transition-colors text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-7 h-7 rounded-full object-cover border border-teal-500/50"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <span>{currentUser.fullName.split(' ')[0]}</span>
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.role}
                </span>
                <span className="text-[9px] text-slate-400 truncate max-w-[80px]">({currentUser.departmentName.split('&')[0]})</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 bg-slate-900 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-teal-500 object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">{currentUser.fullName}</div>
                    <div className="text-[11px] text-teal-400 font-mono">{currentUser.email}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Branch: {currentUser.branchName}</div>
                  </div>
                </div>
              </div>

              {/* CHOOSE PROFILE PICTURE SECTION */}
              <div className="p-3 border-b border-slate-700 bg-slate-850">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Change Profile Picture</span>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
                  ].map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (onUpdateUser) {
                          onUpdateUser({ ...currentUser, avatar: imgUrl });
                        }
                      }}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                        currentUser.avatar === imgUrl ? 'border-teal-400 scale-110 shadow-lg shadow-teal-500/20' : 'border-transparent hover:border-slate-500'
                      }`}
                    >
                      <img src={imgUrl} className="w-full h-full object-cover" alt="Preset Avatar" />
                    </button>
                  ))}
                </div>
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Paste custom image URL..."
                    value={currentUser.avatar.startsWith('http') && ![
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
                    ].includes(currentUser.avatar) ? currentUser.avatar : ''}
                    onChange={(e) => {
                      if (e.target.value.trim() && onUpdateUser) {
                        onUpdateUser({ ...currentUser, avatar: e.target.value.trim() });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-[10px] text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="p-2 bg-slate-850/50 border-b border-slate-700/60">
                <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1 flex items-center justify-between">
                  <span>Role Simulator (Access Control Testing)</span>
                  <UserCheck className="w-3 h-3 text-teal-400" />
                </div>
                <div className="space-y-1 mt-1">
                  {orgUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => { onSelectUser(user); setShowUserMenu(false); }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                        user.id === currentUser.id ? 'bg-teal-500/20 text-white font-semibold' : 'hover:bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <img src={user.avatar} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-xs truncate max-w-[140px]">{user.fullName}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-center border-t border-slate-700/50 flex flex-col gap-2">
                <span className="text-[10px] text-slate-500 block">Notice: Assigned users can only manage their assigned items</span>
                <button
                  onClick={() => {
                    onSelectUser(null);
                    setShowUserMenu(false);
                  }}
                  className="w-full py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg text-xs font-bold transition-colors"
                >
                  Sign Out / Switch Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
