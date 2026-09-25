import { INITIAL_ASSETS, INITIAL_MAINTENANCE } from '../../../../lib/mockData';
import { calculateTotalAssetValue, getAssetsByCondition, getAssetsByAge } from '../../../../lib/report-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch_id = searchParams.get('branch_id') || undefined;
    const org_id = searchParams.get('org_id') || 'org-mineazy'; // default org

    // Filter assets
    const filteredAssets = INITIAL_ASSETS.filter(asset => {
      const matchOrg = asset.orgId === org_id;
      const matchBranch = branch_id ? asset.branchId === branch_id : true;
      return matchOrg && matchBranch;
    });

    // 1. Total assets value
    const totalValue = calculateTotalAssetValue(org_id, branch_id, INITIAL_ASSETS);

    // 2. Total assets by branch
    const branchCounts: Record<string, { count: number; value: number }> = {};
    filteredAssets.forEach(a => {
      if (!branchCounts[a.branchName]) {
        branchCounts[a.branchName] = { count: 0, value: 0 };
      }
      branchCounts[a.branchName].count += 1;
      branchCounts[a.branchName].value += a.currentValue || a.purchaseCost || 0;
    });
    const assetsByBranch = Object.entries(branchCounts).map(([name, data]) => ({
      name,
      count: data.count,
      value: data.value
    }));

    // 3. Assets by category
    const categoryCounts: Record<string, { count: number; value: number }> = {};
    filteredAssets.forEach(a => {
      const cat = a.categoryName || 'General';
      if (!categoryCounts[cat]) {
        categoryCounts[cat] = { count: 0, value: 0 };
      }
      categoryCounts[cat].count += 1;
      categoryCounts[cat].value += a.currentValue || a.purchaseCost || 0;
    });
    const assetsByCategory = Object.entries(categoryCounts).map(([name, data]) => ({
      name,
      value: data.count,
      amount: data.value
    }));

    // 4. Assets by status
    const statusCounts: Record<string, number> = {};
    filteredAssets.forEach(a => {
      const status = a.status || 'ACTIVE';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const assetsByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // 5. Assets by condition
    const conditionCounts = getAssetsByCondition(org_id, filteredAssets);
    const assetsByCondition = Object.entries(conditionCounts).map(([name, value]) => ({ name, value }));

    // 6. Total maintenance cost
    const filteredMaintenance = INITIAL_MAINTENANCE.filter(rec => {
      const asset = INITIAL_ASSETS.find(a => a.id === rec.assetId);
      if (!asset) return false;
      const matchOrg = asset.orgId === org_id;
      const matchBranch = branch_id ? asset.branchId === branch_id : true;
      return matchOrg && matchBranch;
    });
    const totalMaintenanceCost = filteredMaintenance.reduce((sum, rec) => sum + (rec.cost || 0), 0);

    // 7. Average asset age
    const ageCounts = getAssetsByAge(org_id, filteredAssets);
    const currentYear = new Date().getFullYear();
    const ages = filteredAssets.map(a => currentYear - new Date(a.purchaseDate).getFullYear());
    const averageAssetAge = ages.length > 0 ? parseFloat((ages.reduce((sum, a) => sum + a, 0) / ages.length).toFixed(1)) : 2.5;

    // 8. Assets expiring warranty (count) - expiring in the next 12 months
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const now = new Date();
    const warrantyExpiringCount = filteredAssets.filter(a => {
      if (!a.warrantyExpiry) return false;
      const expDate = new Date(a.warrantyExpiry);
      return expDate > now && expDate <= oneYearFromNow;
    }).length;

    // 9. Overdue maintenance count (status PENDING/SCHEDULED and scheduled date < today)
    const overdueMaintenanceCount = filteredMaintenance.filter(rec => {
      if (rec.status === 'COMPLETED' || rec.status === 'CANCELLED') return false;
      const schedDate = new Date(rec.scheduledDate);
      return schedDate < now;
    }).length;

    return Response.json({
      success: true,
      data: {
        totalAssetsValue: totalValue,
        totalAssetsCount: filteredAssets.length,
        assetsByBranch,
        assetsByCategory,
        assetsByStatus,
        assetsByCondition,
        totalMaintenanceCost,
        averageAssetAge,
        warrantyExpiringCount,
        overdueMaintenanceCount,
        ageGroups: ageCounts
      }
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
