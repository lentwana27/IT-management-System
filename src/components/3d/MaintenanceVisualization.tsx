import React, { useEffect } from 'react';
import * as THREE from 'three';
import { MaintenanceRecord } from '../../types';
import { createTextSprite } from '../../lib/three-utils';
import { Wrench, Clock, ShieldCheck } from 'lucide-react';

interface MaintenanceVisualizationProps {
  maintenances: MaintenanceRecord[];
  sceneGroup: THREE.Group;
}

export const MaintenanceVisualization: React.FC<MaintenanceVisualizationProps> = ({
  maintenances,
  sceneGroup
}) => {
  useEffect(() => {
    while (sceneGroup.children.length > 0) {
      sceneGroup.remove(sceneGroup.children[0]!);
    }

    // Timeline Grid along Z axis
    const grid = new THREE.GridHelper(26, 13, 0x475569, 0x1e293b);
    sceneGroup.add(grid);

    const titleSprite = createTextSprite('REPAIRS WORKLOAD & TURNAROUND TIMELINE', `${maintenances.length} Logged Bench Orders`);
    titleSprite.position.set(0, 10, -12);
    sceneGroup.add(titleSprite);

    // Group tickets by type
    const types = ['Motherboard / CPU', 'Display Panels', 'Power Supply', 'Storage/Memory', 'Inspection'];
    const spacingX = 4;
    const startX = -((types.length - 1) * spacingX) / 2;

    types.forEach((type, tIdx) => {
      const posX = startX + tIdx * spacingX;
      
      // Base label
      const typeSprite = createTextSprite(type, '', '#0f172a');
      typeSprite.scale.set(3, 1.2, 1);
      typeSprite.position.set(posX, 0.5, 10);
      sceneGroup.add(typeSprite);

      // Stacked bars along Z
      const matching = maintenances.filter((m, idx) => {
        if (type.includes('Display') && m.description.toLowerCase().includes('screen')) return true;
        if (type.includes('Power') && m.description.toLowerCase().includes('battery')) return true;
        return idx % types.length === tIdx;
      });

      matching.forEach((m, zIdx) => {
        const posZ = 6 - zIdx * 3;
        const barHeight = Math.max(1.5, (m.cost || 250) / 100);

        let color = 0xf59e0b; // Amber in progress
        if (m.status === 'COMPLETED') color = 0x10b981; // Green
        if (m.status === 'PENDING') color = 0x3b82f6; // Blue

        const geo = new THREE.BoxGeometry(2.0, barHeight, 2.0);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.5 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(posX, barHeight / 2, posZ);
        mesh.castShadow = true;
        mesh.userData = { id: m.id, title: `[${m.assetCode}] ${m.type}`, cost: `$${m.cost || 0}`, status: m.status };
        sceneGroup.add(mesh);
      });
    });

  }, [maintenances, sceneGroup]);

  return (
    <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs backdrop-blur-md shadow-2xl max-w-sm space-y-3">
      <div className="flex items-center gap-2 text-rose-400 border-b border-slate-800 pb-2">
        <Wrench className="w-4 h-4" />
        <h4 className="font-bold text-white text-sm">3D Repairs & Outages Timeline</h4>
      </div>
      <p className="text-slate-400 text-[11px]">
        Hardware bench ticket distribution categorized by component failure classification. Column height represents repair labor & part replacement cost.
      </p>
    </div>
  );
};
