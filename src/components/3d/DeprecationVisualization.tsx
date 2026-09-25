import React, { useEffect } from 'react';
import * as THREE from 'three';
import { Asset } from '../../types';
import { createTextSprite } from '../../lib/three-utils';
import { TrendingDown, Zap, Calendar } from 'lucide-react';

interface DeprecationVisualizationProps {
  assets: Asset[];
  sceneGroup: THREE.Group;
}

export const DeprecationVisualization: React.FC<DeprecationVisualizationProps> = ({
  assets,
  sceneGroup
}) => {
  useEffect(() => {
    while (sceneGroup.children.length > 0) {
      sceneGroup.remove(sceneGroup.children[0]!);
    }

    // Axes
    const axes = new THREE.AxesHelper(16);
    sceneGroup.add(axes);

    const xLbl = createTextSprite('X: ASSET AGE (YRS)', '', '#0f172a');
    xLbl.position.set(16, 0, 0);
    sceneGroup.add(xLbl);

    const yLbl = createTextSprite('Y: DEPRECIATION VALUE ($)', '', '#0f172a');
    yLbl.position.set(0, 16, 0);
    sceneGroup.add(yLbl);

    const zLbl = createTextSprite('Z: CLUSTER DISTRIBUTION', '', '#0f172a');
    zLbl.position.set(0, 0, 16);
    sceneGroup.add(zLbl);

    // Grid floor
    const grid = new THREE.GridHelper(24, 12, 0x475569, 0x1e293b);
    grid.position.set(12, 0, 12);
    sceneGroup.add(grid);

    // Plot points
    const now = new Date().getFullYear();

    assets.forEach((ast, idx) => {
      const purchaseYear = ast.purchaseDate ? new Date(ast.purchaseDate).getFullYear() : now - 2;
      const ageYrs = Math.max(0.2, now - purchaseYear);
      const originalPrice = ast.purchasePrice || 1400;

      // Straight-line 4yr depr
      const deprAmount = Math.min(originalPrice, (originalPrice / 4) * ageYrs);

      const posX = Math.min(22, ageYrs * 4);
      const posY = Math.min(20, (deprAmount / 200));
      const posZ = (idx % 8) * 2.5;

      // Color gradient green (new) -> red (old)
      const colorRatio = Math.min(1, ageYrs / 4);
      const color = new THREE.Color().lerpColors(new THREE.Color(0x10b981), new THREE.Color(0xf43f5e), colorRatio);

      const geo = new THREE.SphereGeometry(0.5, 16, 16);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.7, emissive: color, emissiveIntensity: 0.3 });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(posX, posY, posZ);
      sphere.userData = { id: ast.id, title: `${ast.name} (${ageYrs} yr old)`, code: ast.assetCode, depr: `$${Math.round(deprAmount)} depr` };
      sceneGroup.add(sphere);

      // Drop line to floor
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(posX, posY, posZ),
        new THREE.Vector3(posX, 0, posZ)
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.5 });
      sceneGroup.add(new THREE.Line(lineGeo, lineMat));
    });

  }, [assets, sceneGroup]);

  return (
    <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs backdrop-blur-md shadow-2xl max-w-sm space-y-3">
      <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-2">
        <TrendingDown className="w-4 h-4" />
        <h4 className="font-bold text-white text-sm">3D Depreciation Landscape</h4>
      </div>
      <p className="text-slate-400 text-[11px]">
        Spatial plotting of hardware age vs. monetary book devaluation. Nodes shift from emerald (brand new) to crimson (fully amortized 4+ yrs).
      </p>
    </div>
  );
};
