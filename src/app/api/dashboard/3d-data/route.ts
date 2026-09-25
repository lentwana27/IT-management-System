import { NextResponse } from 'next/server';

/**
 * File 11 Deliverable: src/app/api/dashboard/3d-data/route.ts
 * GET /api/dashboard/3d-data
 * Delivers aggregated spatial telemetry, branch floor counts, and real-time event feeds for Three.js
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('org_id') || 'org-mineazy';

  // Simulated database aggregation response for Three.js 3D Projection Engine
  const dataPayload = {
    timestamp: new Date().toISOString(),
    orgId,
    fleetHealthScore: 94.2,
    branches: [
      {
        id: 'b1',
        name: 'London HQ',
        code: 'LON-01',
        coordinates: { x: -12, y: 0, z: 8 },
        metrics: { totalAssets: 142, active: 135, repair: 5, storage: 2, totalValueUSD: 342000 }
      },
      {
        id: 'b2',
        name: 'Tokyo Branch',
        code: 'TYO-02',
        coordinates: { x: 14, y: 0, z: -10 },
        metrics: { totalAssets: 89, active: 82, repair: 6, storage: 1, totalValueUSD: 215000 }
      },
      {
        id: 'b3',
        name: 'New York Hub',
        code: 'NYC-03',
        coordinates: { x: -8, y: 0, z: -14 },
        metrics: { totalAssets: 118, active: 114, repair: 3, storage: 1, totalValueUSD: 289000 }
      }
    ],
    categoryClusters: [
      { category: 'Laptop', totalUnits: 184, underRepair: 8, avgAgeYears: 1.4 },
      { category: 'Desktop/Tower', totalUnits: 72, underRepair: 2, avgAgeYears: 2.8 },
      { category: 'Monitor/Display', totalUnits: 210, underRepair: 11, avgAgeYears: 3.1 },
      { category: 'POS Terminal', totalUnits: 45, underRepair: 1, avgAgeYears: 1.1 },
      { category: 'Server/Rack', totalUnits: 14, underRepair: 0, avgAgeYears: 2.2 }
    ],
    depreciationCurve: [
      { ageYear: 0, retainedValuePct: 100 },
      { ageYear: 1, retainedValuePct: 78 },
      { ageYear: 2, retainedValuePct: 55 },
      { ageYear: 3, retainedValuePct: 32 },
      { ageYear: 4, retainedValuePct: 10 }
    ],
    activeRepairsTimeline: [
      { ticketId: 'mnt-88', assetCode: 'AST-104', type: 'Display Panels', priority: 'HIGH', status: 'IN_PROGRESS', costUSD: 420 },
      { ticketId: 'mnt-91', assetCode: 'AST-209', type: 'Motherboard / CPU', priority: 'HIGH', status: 'IN_PROGRESS', costUSD: 850 },
      { ticketId: 'mnt-94', assetCode: 'AST-311', type: 'Power Supply / Batteries', priority: 'MEDIUM', status: 'PENDING', costUSD: 180 }
    ],
    realtimeEventsStream: [
      { id: 'ev-101', type: 'ASSET_ADDED', title: 'MacBook Pro M3 Enrolled', timestamp: 'Just now', branchCode: 'LON-01' },
      { id: 'ev-102', type: 'REPAIR_COMPLETED', title: 'AST-104 Panel Replaced', timestamp: '4m ago', branchCode: 'TYO-02' }
    ]
  };

  return NextResponse.json({
    success: true,
    engineVersion: 'Three.js WebGL r160+',
    data: dataPayload
  });
}
