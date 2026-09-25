import { INITIAL_ASSETS, DEPARTMENTS } from '../../../../lib/mockData';
import { getAssetsByAge } from '../../../../lib/report-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch_id = searchParams.get('branch_id') || undefined;
    const department_id = searchParams.get('department_id') || undefined;

    const org_id = 'org-mineazy';

    // Filter assets
    const filteredAssets = INITIAL_ASSETS.filter(asset => {
      const matchOrg = asset.orgId === org_id;
      const matchBranch = branch_id ? asset.branchId === branch_id : true;
      const matchDept = department_id ? asset.departmentId === department_id : true;
      return matchOrg && matchBranch && matchDept;
    });

    // 1. Assets by Age Group
    const ageGroups = getAssetsByAge(org_id, filteredAssets);
    const ageGroupsChart = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

    // 2. Oldest Assets
    const oldestAssets = [...filteredAssets]
      .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime())
      .slice(0, 5)
      .map(a => {
        const age = new Date().getFullYear() - new Date(a.purchaseDate).getFullYear();
        return {
          id: a.id,
          asset_code: a.assetCode,
          name: a.name,
          category: a.categoryName,
          purchase_date: a.purchaseDate,
          purchase_cost: a.purchaseCost,
          age_years: age,
          condition: a.condition
        };
      });

    // 3. Assets reaching end of life (age >= 5 or condition POOR)
    const endOfLifeAssets = filteredAssets
      .filter(a => {
        const age = new Date().getFullYear() - new Date(a.purchaseDate).getFullYear();
        return age >= 5 || a.condition === 'POOR';
      })
      .map(a => {
        const age = new Date().getFullYear() - new Date(a.purchaseDate).getFullYear();
        return {
          id: a.id,
          asset_code: a.assetCode,
          name: a.name,
          category: a.categoryName,
          purchase_date: a.purchaseDate,
          age_years: age,
          condition: a.condition
        };
      });

    // 4. Replacement Recommendations
    const replacementRecommendations = endOfLifeAssets.map(a => {
      let replacementAction = 'Monitor closely';
      let urgency: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      let estimatedCost = a.purchase_date ? INITIAL_ASSETS.find(orig => orig.id === a.id)?.purchaseCost || 1500 : 1500;

      if (a.condition === 'POOR') {
        replacementAction = 'Immediate decommission & buy-replacement';
        urgency = 'HIGH';
      } else if (a.age_years >= 6) {
        replacementAction = 'Schedule retirement & replace with newer model';
        urgency = 'HIGH';
      } else if (a.age_years >= 4) {
        replacementAction = 'Budget for replacement next fiscal cycle';
        urgency = 'MEDIUM';
      }

      return {
        asset_id: a.id,
        asset_code: a.asset_code,
        name: a.name,
        category: a.category,
        age_years: a.age_years,
        condition: a.condition,
        action: replacementAction,
        urgency,
        estimated_cost: estimatedCost
      };
    });

    return Response.json({
      success: true,
      summary: {
        total_assets_analyzed: filteredAssets.length,
        average_age: oldestAssets.length > 0 ? parseFloat((oldestAssets.reduce((sum, a) => sum + a.age_years, 0) / oldestAssets.length).toFixed(1)) : 3.0,
        assets_near_end_of_life: endOfLifeAssets.length,
        replacement_required_count: replacementRecommendations.filter(r => r.urgency === 'HIGH').length
      },
      age_groups: ageGroupsChart,
      oldest_assets: oldestAssets,
      end_of_life_assets: endOfLifeAssets,
      replacement_recommendations: replacementRecommendations
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
