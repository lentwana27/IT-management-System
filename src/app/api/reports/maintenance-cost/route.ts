import { INITIAL_ASSETS, INITIAL_MAINTENANCE } from '../../../../lib/mockData';
import { getMaintenanceCostAnalysis } from '../../../../lib/report-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch_id = searchParams.get('branch_id') || undefined;
    const date_range = searchParams.get('date_range') || 'ALL'; // e.g. 2026, 2025
    const asset_category = searchParams.get('asset_category') || undefined;

    const org_id = 'org-mineazy';

    // Get baseline analysis
    const analysis = getMaintenanceCostAnalysis(org_id, date_range, INITIAL_MAINTENANCE, INITIAL_ASSETS);

    // Filter maintenance records according to selected parameters
    const records = INITIAL_MAINTENANCE.filter(rec => {
      const asset = INITIAL_ASSETS.find(a => a.id === rec.assetId);
      if (!asset) return false;
      if (branch_id && asset.branchId !== branch_id) return false;
      if (asset_category && asset.categoryId !== asset_category) return false;
      if (date_range && date_range !== 'ALL') {
        return rec.createdAt.includes(date_range) || rec.scheduledDate.includes(date_range);
      }
      return true;
    });

    // Cost by Technician
    const technicianMap: Record<string, number> = {};
    records.forEach(rec => {
      const tech = rec.technicianName || 'In-House Service';
      technicianMap[tech] = (technicianMap[tech] || 0) + (rec.cost || 0);
    });
    const costByTechnician = Object.entries(technicianMap).map(([name, cost]) => ({ name, cost }));

    // Most expensive repairs
    const mostExpensiveRepairs = [...records]
      .sort((a, b) => (b.cost || 0) - (a.cost || 0))
      .slice(0, 5)
      .map(rec => {
        const asset = INITIAL_ASSETS.find(a => a.id === rec.assetId);
        return {
          id: rec.id,
          asset_code: rec.assetCode,
          asset_name: asset?.name || 'Unknown Asset',
          type: rec.type,
          priority: rec.priority,
          cost: rec.cost,
          issue_description: rec.issueDescription || rec.description || 'Routine service'
        };
      });

    // Cost breakdown by status
    const statusMap: Record<string, number> = {};
    records.forEach(rec => {
      statusMap[rec.status] = (statusMap[rec.status] || 0) + (rec.cost || 0);
    });
    const costByStatus = Object.entries(statusMap).map(([name, cost]) => ({ name, cost }));

    return Response.json({
      success: true,
      summary: {
        total_cost: records.reduce((sum, r) => sum + (r.cost || 0), 0),
        average_repair_time_hours: analysis.averageRepairTime,
        preventive_cost: records.filter(r => r.type === 'PREVENTIVE' || r.type === 'ROUTINE').reduce((sum, r) => sum + (r.cost || 0), 0),
        reactive_cost: records.filter(r => r.type === 'REACTIVE' || r.type === 'EMERGENCY').reduce((sum, r) => sum + (r.cost || 0), 0),
        count: records.length
      },
      cost_by_category: analysis.costByCategory,
      cost_by_technician: costByTechnician,
      cost_by_status: costByStatus,
      most_expensive_repairs: mostExpensiveRepairs,
      monthly_trend: analysis.monthlyTrend,
      forecast: analysis.forecast
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
