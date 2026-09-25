import { INITIAL_BUDGETS, DEPARTMENTS } from '../../../../lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch_id = searchParams.get('branch_id') || undefined;
    const department_id = searchParams.get('department_id') || undefined;
    const fiscal_year = searchParams.get('fiscal_year') || '2026';

    const org_id = 'org-mineazy';

    // Filter budgets
    const budgets = INITIAL_BUDGETS.filter(b => {
      const matchOrg = b.orgId === org_id;
      const matchYr = b.fiscalYear === fiscal_year;
      const matchDept = department_id ? b.departmentId === department_id : true;
      // In our mock budgets, we don't have explicit branchId directly on the budget,
      // but we can filter or mock as requested.
      return matchOrg && matchYr && matchDept;
    });

    const allocated = budgets.reduce((sum, b) => sum + b.amount, 0);
    const spent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const remaining = allocated - spent;

    // Spending by category
    const spendingByCategory = budgets.map(b => ({
      category: b.category,
      allocated: b.amount,
      spent: b.spent,
      remaining: b.amount - b.spent,
      percentage_used: b.amount > 0 ? parseFloat(((b.spent / b.amount) * 100).toFixed(1)) : 0
    }));

    // Budget utilization by department
    const spendingByDepartment = DEPARTMENTS.filter(d => d.orgId === org_id).map(d => {
      // Find matching budget item for this department
      const deptBudgets = INITIAL_BUDGETS.filter(b => b.departmentId === d.id && b.fiscalYear === fiscal_year);
      const deptAllocated = deptBudgets.reduce((sum, b) => sum + b.amount, 0) || d.budgetAllocated || 100000;
      const deptSpent = deptBudgets.reduce((sum, b) => sum + b.spent, 0) || Math.round(deptAllocated * 0.65);
      
      return {
        department_id: d.id,
        department_name: d.name,
        allocated: deptAllocated,
        spent: deptSpent,
        remaining: deptAllocated - deptSpent,
        percentage_used: parseFloat(((deptSpent / deptAllocated) * 100).toFixed(1))
      };
    });

    // Burn rate calculation (spent / 6 months elapsed)
    const burnRateMonthly = Math.round(spent / 6);
    const projectEndOfYear = burnRateMonthly * 12;
    const budgetAlerts = spendingByCategory
      .filter(item => item.percentage_used >= 85)
      .map(item => ({
        category: item.category,
        percentage_used: item.percentage_used,
        message: `Budget Category '${item.category}' is critically high at ${item.percentage_used}% usage.`
      }));

    return Response.json({
      success: true,
      fiscal_year,
      summary: {
        total_allocated: allocated,
        total_spent: spent,
        total_remaining: remaining,
        overall_utilization_percent: allocated > 0 ? parseFloat(((spent / allocated) * 100).toFixed(1)) : 0,
        burn_rate_monthly: burnRateMonthly,
        end_of_year_forecast: projectEndOfYear,
        is_over_budget: projectEndOfYear > allocated
      },
      spending_by_category: spendingByCategory,
      spending_by_department: spendingByDepartment,
      budget_alerts: budgetAlerts
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
