import { INITIAL_ASSETS } from '../../../../lib/mockData';
import { calculateDepreciation } from '../../../../lib/report-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch_id = searchParams.get('branch_id') || undefined;
    const method = (searchParams.get('depreciation_method') as 'STRAIGHT_LINE' | 'DOUBLE_DECLINING') || 'STRAIGHT_LINE';
    const fiscal_year = searchParams.get('fiscal_year') || String(new Date().getFullYear());

    // Filter assets
    const filteredAssets = INITIAL_ASSETS.filter(asset => {
      const matchBranch = branch_id ? asset.branchId === branch_id : true;
      return matchBranch;
    });

    let totalPurchaseCost = 0;
    let totalAnnualDepreciation = 0;
    let totalAccumulatedDepreciation = 0;
    let totalBookValue = 0;

    // Group assets by category with calculations
    const categoriesMap: Record<string, any[]> = {};

    filteredAssets.forEach(asset => {
      const calc = calculateDepreciation(asset, method);
      totalPurchaseCost += asset.purchaseCost;
      totalAnnualDepreciation += calc.annualDepreciation;
      totalAccumulatedDepreciation += calc.accumulatedDepreciation;
      totalBookValue += calc.bookValue;

      const catName = asset.categoryName || 'General';
      if (!categoriesMap[catName]) {
        categoriesMap[catName] = [];
      }

      categoriesMap[catName].push({
        asset_id: asset.id,
        asset_code: asset.assetCode,
        name: asset.name,
        purchase_date: asset.purchaseDate,
        purchase_cost: asset.purchaseCost,
        annual_depreciation: calc.annualDepreciation,
        accumulated_depreciation: calc.accumulatedDepreciation,
        book_value: calc.bookValue
      });
    });

    // Format grouped categories
    const categoriesReport = Object.entries(categoriesMap).map(([category, items]) => {
      const catCost = items.reduce((sum, item) => sum + item.purchase_cost, 0);
      const catDep = items.reduce((sum, item) => sum + item.annual_depreciation, 0);
      const catAccum = items.reduce((sum, item) => sum + item.accumulated_depreciation, 0);
      const catBookVal = items.reduce((sum, item) => sum + item.book_value, 0);

      return {
        category,
        summary: {
          purchase_cost: catCost,
          annual_depreciation: catDep,
          accumulated_depreciation: catAccum,
          book_value: catBookVal
        },
        items
      };
    });

    // Simple trend: Projected book values over the next 5 years
    const trend = [];
    const baseYear = parseInt(fiscal_year);
    for (let yearOffset = 0; yearOffset < 5; yearOffset++) {
      let projectedBookValue = 0;
      filteredAssets.forEach(asset => {
        // Mock a future projection of book value
        const cost = asset.purchaseCost;
        const deprFactor = method === 'STRAIGHT_LINE' ? 0.15 : 0.25;
        const yearSpan = (baseYear - new Date(asset.purchaseDate).getFullYear()) + yearOffset;
        const currentVal = Math.max(cost * 0.1, cost * Math.pow(1 - deprFactor, Math.max(0, yearSpan)));
        projectedBookValue += currentVal;
      });

      trend.push({
        year: String(baseYear + yearOffset),
        book_value: Math.round(projectedBookValue)
      });
    }

    return Response.json({
      success: true,
      summary: {
        total_purchase_cost: totalPurchaseCost,
        total_annual_depreciation: totalAnnualDepreciation,
        total_accumulated_depreciation: totalAccumulatedDepreciation,
        total_book_value: totalBookValue,
        depreciation_method: method,
        fiscal_year
      },
      categories: categoriesReport,
      trend
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
