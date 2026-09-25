import React from 'react';
import { Asset, User } from '../types';
import { Laptop, Server, Smartphone, HardDrive, Wrench, ArrowRight, UserCheck, ShieldAlert, DollarSign, Phone, Mail } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  currentUser: User;
  onViewDetail: (asset: Asset) => void;
  onQuickCheckout?: (asset: Asset) => void;
  onQuickEdit?: (asset: Asset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  currentUser,
  onViewDetail,
  onQuickCheckout,
  onQuickEdit
}) => {
  const isAdminOrSupport = currentUser.role === 'ADMIN' || currentUser.role === 'IT_SUPPORT';

  const getCategoryIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes('server')) return <Server className="w-4 h-4 text-purple-400" />;
    if (lower.includes('mobile') || lower.includes('phone')) return <Smartphone className="w-4 h-4 text-emerald-400" />;
    if (lower.includes('network') || lower.includes('switch')) return <HardDrive className="w-4 h-4 text-sky-400" />;
    return <Laptop className="w-4 h-4 text-teal-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'REPAIR': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DAMAGED': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'DEPRECATED': return 'bg-slate-800 text-slate-400 border-slate-700';
      default: return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    }
  };

  return (
    <div className="group bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition hover:border-teal-500/50 hover:shadow-teal-500/10 flex flex-col justify-between">
      {/* Image Banner */}
      <div className="relative h-44 w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onViewDetail(asset)}>
        <img
          src={asset.imageUrl}
          alt={asset.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider backdrop-blur-md ${getStatusColor(asset.status)}`}>
            {asset.status}
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5 text-xs text-slate-300 font-mono">
          {getCategoryIcon(asset.categoryName)}
          <span>{asset.assetCode}</span>
        </div>

        {/* Condition tag */}
        <div className="absolute bottom-2 left-3">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
            Cond: <strong className={asset.condition === 'NEW' ? 'text-emerald-400' : 'text-amber-400'}>{asset.condition}</strong>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onViewDetail(asset)}
            className="font-bold text-slate-100 text-sm md:text-base group-hover:text-teal-400 transition cursor-pointer line-clamp-1"
          >
            {asset.name}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5 line-clamp-1">
            {asset.model} • SN: {asset.serialNumber}
          </p>

          {(asset.phoneNumber || asset.registeredEmail) && (
            <div className="mt-2 p-2 rounded-xl bg-slate-950/80 border border-emerald-500/20 flex flex-col gap-1 text-[11px] font-mono">
              {asset.phoneNumber && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold truncate">
                  <Phone className="w-3 h-3 shrink-0 text-emerald-400" />
                  <span className="truncate">{asset.phoneNumber}</span>
                </div>
              )}
              {asset.registeredEmail && (
                <div className="flex items-center gap-1.5 text-sky-300 truncate text-[10.5px]">
                  <Mail className="w-3 h-3 shrink-0 text-sky-400" />
                  <span className="truncate">{asset.registeredEmail}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Financial & Assignment Stats */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Book Value</span>
            <span className="font-mono font-bold text-teal-400 text-sm flex items-center">
              <DollarSign className="w-3.5 h-3.5 -mr-0.5 text-teal-500/80" />
              {asset.currentValue.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 overflow-hidden">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Custody</span>
            <span className="font-medium text-slate-300 truncate block text-xs mt-0.5 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="truncate">{asset.assignedToUserName || 'Unassigned'}</span>
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={() => onViewDetail(asset)}
            className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition flex items-center justify-center gap-1.5"
          >
            <span>View Specs</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
          </button>

          {isAdminOrSupport && onQuickEdit && (
            <button
              onClick={() => onQuickEdit(asset)}
              className="px-3 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center"
              title="Edit Asset"
            >
              <Wrench className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
