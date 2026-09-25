import { INITIAL_ASSETS } from '../../../../lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch_id = searchParams.get('branch_id');
    const department_id = searchParams.get('department_id');
    const category_id = searchParams.get('category_id');
    const export_format = searchParams.get('export_format'); // 'pdf' | 'csv' | 'xlsx' | null

    const data = INITIAL_ASSETS.filter(asset => {
      if (branch_id && asset.branchId !== branch_id) return false;
      if (department_id && asset.departmentId !== department_id) return false;
      if (category_id && asset.categoryId !== category_id) return false;
      return true;
    }).map(asset => {
      const now = new Date();
      const isWarrantyActive = asset.warrantyExpiry ? new Date(asset.warrantyExpiry) > now : false;
      
      return {
        asset_code: asset.assetCode,
        name: asset.name,
        model: asset.model,
        serial: asset.serialNumber || 'N/A',
        category: asset.categoryName,
        status: asset.status,
        condition: asset.condition,
        purchase_date: asset.purchaseDate,
        purchase_cost: asset.purchaseCost,
        current_value: asset.currentValue,
        assigned_to: asset.assignedToUserName || 'Unassigned',
        warranty_status: isWarrantyActive ? 'Active' : 'Expired/None'
      };
    });

    return Response.json({
      success: true,
      export_format,
      count: data.length,
      data
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
