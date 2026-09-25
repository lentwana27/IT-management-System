import React, { useState } from 'react';
import ReportsLandingPage from '../app/reports/page';
import ReportsDashboardPage from '../app/reports/dashboard/page';
import ReportsInventoryPage from '../app/reports/inventory/page';
import ReportsDepreciationPage from '../app/reports/depreciation/page';

import { 
  Wrench, PieChart, Clock, ShieldCheck, ArrowLeftRight, 
  ArrowLeft, Info, Calendar, Sparkles, TrendingUp, DollarSign
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, PieChart as ReChartsPie, Pie
} from 'recharts';
import { 
  INITIAL_ASSETS, 
  INITIAL_MAINTENANCE, 
  INITIAL_BUDGETS, 
  MINEAZY_BRANCHES, 
  DEPARTMENTS 
} from '../mockData';
import { getMaintenanceCostAnalysis, getBudgetUtilization, getAssetsByAge } from '../lib/report-service';
import { ReportExport } from './ReportExport';

interface ReportsPanelProps {
  assets?: typeof INITIAL_ASSETS;
  maintenances?: typeof INITIAL_MAINTENANCE;
  budgets?: typeof INITIAL_BUDGETS;
}

export const ReportsPanel: React.FC<ReportsPanelProps> = ({
  assets = INITIAL_ASSETS,
  maintenances = INITIAL_MAINTENANCE,
  budgets = INITIAL_BUDGETS
}) => {
  const [activeReport, setActiveReport] = useState<string>('landing');

  // If a report is chosen, we switch on it
  if (activeReport === 'dashboard') {
    return (
      <ReportsDashboardPage 
        onBack={() => setActiveReport('landing')} 
        assets={assets} 
        maintenances={maintenances}
      />
    );
  }

  if (activeReport === 'inventory') {
    return (
      <ReportsInventoryPage 
        onBack={() => setActiveReport('landing')} 
        assets={assets} 
      />
    );
  }

  if (activeReport === 'depreciation') {
    return (
      <ReportsDepreciationPage 
        onBack={() => setActiveReport('landing')} 
        assets={assets} 
      />
    );
  }

  // 1. Interactive Maintenance Cost Report Subview
  if (activeReport === 'maintenance') {
    const analysis = getMaintenanceCostAnalysis('org-mineazy', 'ALL', maintenances, assets);
    
    // Prepare table for most expensive repairs
    const mostExpensive = [...maintenances]
      .sort((a, b) => (b.cost || 0) - (a.cost || 0))
      .slice(0, 5);

    const exportData = maintenances.map(m => {
      const asset = assets.find(a => a.id === m.assetId);
      return {
        'Ticket ID': m.id,
        'Asset Code': m.assetCode,
        'Asset Name': asset?.name || 'Device',
        'Type': m.type,
        'Priority': m.priority,
        'Technician': m.assignedTechnician || 'In-House Service',
        'Scheduled Date': m.startDate,
        'Cost': `$${(m.cost || 0).toLocaleString()}`,
        'Status': m.status
      };
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveReport('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          <h1 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Maintenance Cost Analysis Ledger</span>
          </h1>
        </div>

        <ReportExport 
          data={exportData} 
          filename="Maintenance_Cost_Analysis" 
          title="MAINTENANCE COST ANALYSIS" 
        />

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Accumulated Repair Spent</div>
            <div className="text-lg font-bold text-slate-100 font-mono mt-1">${analysis.totalCost.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Average Repair Window</div>
            <div className="text-lg font-bold text-indigo-300 mt-1">{analysis.averageRepairTime} hours</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Preventive Routine Cost</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">${analysis.preventiveCost.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Reactive / Emergency Cost</div>
            <div className="text-lg font-bold text-rose-400 font-mono mt-1">${analysis.reactiveCost.toLocaleString()}</div>
          </div>
        </div>

        {/* Forecasting & Trend Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
              <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
              Machine-Learning Maintenance Cost Forecasting (Next Quarter)
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[...analysis.monthlyTrend, ...analysis.forecast]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Area type="monotone" dataKey="cost" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Cost Distribution by Category
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(analysis.costByCategory).map(([name, cost]) => ({ name, cost }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a' }} />
                  <Bar dataKey="cost" fill="#0f766e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Most Expensive Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-md">
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/40">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Most Cost-Intensive Maintenance Work</h4>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="bg-slate-950/80 text-slate-500 font-bold border-b border-slate-900">
                <th className="p-3">Asset Code</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Type</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Technician</th>
                <th className="p-3">Completed/Scheduled</th>
                <th className="p-3 text-right">Invoice Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {mostExpensive.map(rec => {
                const asset = assets.find(a => a.id === rec.assetId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-900/20">
                    <td className="p-3 font-mono text-teal-400 font-bold">{rec.assetCode}</td>
                    <td className="p-3 text-slate-200 font-semibold">{asset?.name || 'Hardware'}</td>
                    <td className="p-3 font-medium">{rec.type}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rec.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {rec.priority}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{rec.assignedTechnician || 'In-house'}</td>
                    <td className="p-3 text-slate-400">{rec.startDate}</td>
                    <td className="p-3 text-right font-mono text-teal-300 font-bold">${(rec.cost || 0).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. Interactive Budget Tracking Subview
  if (activeReport === 'budget') {
    const analysis = getBudgetUtilization('org-mineazy', '2026', budgets, maintenances, assets);

    const exportData = analysis.utilizationByCategory.map(u => ({
      'Budget Category': u.category,
      'Allocated Amount': `$${u.allocated.toLocaleString()}`,
      'Spent Amount': `$${u.spent.toLocaleString()}`,
      'Remaining Balance': `$${u.remaining.toLocaleString()}`,
      'Usage Percentage': `${u.percentage}%`
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveReport('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          <h1 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <span>Budget Utilization Ledger</span>
          </h1>
        </div>

        <ReportExport 
          data={exportData} 
          filename="Budget_Utilization_Report" 
          title="BUDGET UTILIZATION LEDGER" 
        />

        {/* summary block */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Total Budget Allocated</div>
            <div className="text-lg font-bold text-slate-100 font-mono mt-1">${analysis.allocated.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Total Budget Spent</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-1">${analysis.spent.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-teal-950/20 border border-teal-500/20">
            <div className="text-[10px] text-teal-400 font-bold uppercase">Remaining Fiscal Capital</div>
            <div className="text-lg font-bold text-teal-300 font-mono mt-1">${analysis.remaining.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Monthly Burn Rate</div>
            <div className="text-lg font-bold text-indigo-300 font-mono mt-1">${analysis.burnRateMonthly.toLocaleString()} / mo</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Budget Utilization by Department</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPARTMENTS.slice(0, 5).map(d => ({ name: d.name.substring(0, 15), Allocated: d.budgetAllocated, Spent: Math.round(d.budgetAllocated * 0.68) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a' }} />
                  <Legend />
                  <Bar dataKey="Allocated" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Spent" fill="#0f766e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table category breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Allocations Breakdown by Category</h3>
            <div className="space-y-3">
              {analysis.utilizationByCategory.map((u, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">{u.category}</span>
                    <span className="font-mono text-slate-400">${u.spent.toLocaleString()} / ${u.allocated.toLocaleString()} ({u.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${u.percentage >= 85 ? 'bg-rose-500' : u.percentage >= 60 ? 'bg-amber-500' : 'bg-teal-500'}`}
                      style={{ width: `${Math.min(100, u.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Interactive Asset Age & Condition Subview
  if (activeReport === 'age') {
    const ageAnalysis = getAssetsByAge('org-mineazy', assets);
    const chartData = Object.entries(ageAnalysis).map(([name, value]) => ({ name, value }));

    const endOfLife = assets.filter(a => {
      const yr = new Date(a.purchaseDate).getFullYear();
      const age = new Date().getFullYear() - yr;
      return age >= 5 || a.condition === 'POOR';
    });

    const exportData = assets.map(a => {
      const age = new Date().getFullYear() - new Date(a.purchaseDate).getFullYear();
      return {
        'Asset Code': a.assetCode,
        'Asset Name': a.name,
        'Category': a.categoryName,
        'Purchase Date': a.purchaseDate,
        'Age (Years)': age,
        'Condition': a.condition,
        'Recommendation': age >= 5 ? 'Schedule Retirement' : a.condition === 'POOR' ? 'Immediate Replacement' : 'Monitor'
      };
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveReport('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          <h1 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Asset Age & Condition Report</span>
          </h1>
        </div>

        <ReportExport 
          data={exportData} 
          filename="Asset_Age_and_Condition" 
          title="ASSET AGE & CONDITION ANALYSIS" 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart age brackets */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Units by Operational Age Bracket</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a' }} />
                  <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* End of life assets list */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-rose-400 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Retirement/Replacement Recommendations ({endOfLife.length} items)
            </h3>
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
              {endOfLife.map(a => {
                const age = new Date().getFullYear() - new Date(a.purchaseDate).getFullYear();
                return (
                  <div key={a.id} className="p-3 bg-slate-950/60 rounded-xl border border-rose-500/10 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-rose-300 font-mono block">{a.assetCode}</span>
                      <span className="text-slate-300 font-medium">{a.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Age: {age} yrs</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">
                        {age >= 5 ? 'RETIRE' : 'POOR COND.'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Interactive Warranty Tracking Subview
  if (activeReport === 'warranty') {
    const warrantyItems = assets.map(a => {
      const now = new Date();
      const expDate = a.warrantyExpiry ? new Date(a.warrantyExpiry) : null;
      const isExpired = expDate ? expDate < now : true;
      return {
        ...a,
        isExpired,
        expDate
      };
    });

    const exportData = warrantyItems.map(w => ({
      'Asset Code': w.assetCode,
      'Asset Name': w.name,
      'Category': w.categoryName,
      'Warranty Expiry': w.warrantyExpiry || 'N/A',
      'Status': w.isExpired ? 'Expired' : 'Active'
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveReport('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          <h1 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span>Warranty Compliance Analysis</span>
          </h1>
        </div>

        <ReportExport 
          data={exportData} 
          filename="Asset_Warranty_Compliance" 
          title="WARRANTY COMPLIANCE REPORT" 
        />

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-850">
                <th className="p-3">Asset Code</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Category</th>
                <th className="p-3">Warranty Expiry</th>
                <th className="p-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {warrantyItems.map(w => (
                <tr key={w.id} className="hover:bg-slate-900/20">
                  <td className="p-3 font-mono text-teal-400 font-bold">{w.assetCode}</td>
                  <td className="p-3 text-slate-200 font-semibold">{w.name}</td>
                  <td className="p-3 text-slate-400">{w.categoryName}</td>
                  <td className="p-3 font-mono">{w.warrantyExpiry || 'Lifetime/None'}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      w.isExpired ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {w.isExpired ? 'EXPIRED' : 'ACTIVE COVERAGE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 5. Interactive Custody Checkout History Subview
  if (activeReport === 'checkout') {
    const exportData = assets.map(a => ({
      'Asset Code': a.assetCode,
      'Asset Name': a.name,
      'Custodian': a.assignedToUserName || 'In Storage Warehouse',
      'Location': a.branchName,
      'Current Value': `$${(a.currentValue || a.purchaseCost).toLocaleString()}`
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveReport('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          <h1 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ArrowLeftRight className="w-4 h-4 text-pink-400" />
            <span>Custody Handovers Analysis</span>
          </h1>
        </div>

        <ReportExport 
          data={exportData} 
          filename="Custody_Handovers_Report" 
          title="CUSTODY HANDOVERS AUDIT" 
        />

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-850">
                <th className="p-3">Asset Code</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Current Custodian</th>
                <th className="p-3">Branch Location</th>
                <th className="p-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {assets.map(a => (
                <tr key={a.id} className="hover:bg-slate-900/20">
                  <td className="p-3 font-mono text-teal-400 font-bold">{a.assetCode}</td>
                  <td className="p-3 text-slate-200 font-semibold">{a.name}</td>
                  <td className="p-3 text-slate-300">{a.assignedToUserName || <span className="text-slate-600 italic">Storage Warehouse</span>}</td>
                  <td className="p-3 text-slate-400">{a.branchName}</td>
                  <td className="p-3 text-right font-mono font-bold text-teal-300">${(a.currentValue || a.purchaseCost).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Fallback / Landing view
  return (
    <ReportsLandingPage 
      onSelectReport={setActiveReport} 
      assets={assets} 
    />
  );
};
