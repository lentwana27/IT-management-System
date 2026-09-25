import React, { useEffect } from 'react';
import * as THREE from 'three';
import { Asset } from '../../types';
import { createTextSprite } from '../../lib/three-utils';
import { Cpu, Laptop, Monitor, Smartphone, Printer, HardDrive, Layers } from 'lucide-react';

interface AssetCategoryVisualizationProps {
  assets: Asset[];
  sceneGroup: THREE.Group;
  onSelectCategory: (cat: string) => void;
}

export const AssetCategoryVisualization: React.FC<AssetCategoryVisualizationProps> = ({
  assets,
  sceneGroup,
  onSelectCategory
}) => {
  // Group assets by category
  const categoryCounts: Record<string, { total: number; repair: number; value: number }> = assets.reduce((acc: Record<string, { total: number; repair: number; value: number }>, ast: any) => {
    const catName = ast.category || ast.categoryName || 'General';
    if (!acc[catName]) acc[catName] = { total: 0, repair: 0, value: 0 };
    acc[catName]!.total += 1;
    if (ast.status === 'REPAIR') acc[catName]!.repair += 1;
    acc[catName]!.value += ast.purchasePrice || ast.purchaseCost || 1200;
    return acc;
  }, {});

  const categories = Object.keys(categoryCounts);

  useEffect(() => {
    while (sceneGroup.children.length > 0) {
      sceneGroup.remove(sceneGroup.children[0]!);
    }

    const count = categories.length || 1;
    const radius = 10;

    categories.forEach((cat, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const posX = Math.cos(angle) * radius;
      const posZ = Math.sin(angle) * radius;
      const stats = categoryCounts[cat]!;

      // Height scaled by count
      const height = Math.max(1.5, stats.total * 0.8);

      const geo = new THREE.BoxGeometry(2.8, height, 2.8);
      const color = stats.repair > 0 ? 0xf43f5e : 0x6366f1;
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.5,
        emissive: color,
        emissiveIntensity: 0.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(posX, height / 2, posZ);
      mesh.castShadow = true;
      mesh.userData = { id: `cat-${cat}`, title: cat, category: cat, total: stats.total, repair: stats.repair };
      sceneGroup.add(mesh);

      // Floating title sprite
      const sprite = createTextSprite(cat, `${stats.total} Units (${stats.repair} Repair)`, stats.repair > 0 ? '#881337' : '#1e1b4b');
      sprite.position.set(posX, height + 2.5, posZ);
      sceneGroup.add(sprite);

      // Ring pedestal
      const ringGeo = new THREE.RingGeometry(1.8, 2.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(posX, 0.05, posZ);
      sceneGroup.add(ring);
    });

    // Central core pillar
    const coreGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 4, 0);
    sceneGroup.add(core);

    const coreSprite = createTextSprite('GLOBAL CATALOG', `${assets.length} Total Hardware Items`);
    coreSprite.position.set(0, 10, 0);
    sceneGroup.add(coreSprite);

  }, [assets, categories, categoryCounts, sceneGroup]);

  return (
    <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs backdrop-blur-md shadow-2xl max-w-sm space-y-3">
      <div className="flex items-center gap-2 text-indigo-400 border-b border-slate-800 pb-2">
        <Layers className="w-4 h-4" />
        <h4 className="font-bold text-white text-sm">3D Category Clusters</h4>
      </div>
      <p className="text-slate-400 text-[11px]">
        Spatial distribution of hardware classes. Pillar height corresponds directly to total item count per category.
      </p>
      
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {categories.map(c => (
          <div key={c} onClick={() => onSelectCategory(c)} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 cursor-pointer transition-all">
            <span className="font-bold text-slate-200">{c}</span>
            <span className="font-mono text-indigo-400 font-bold">{categoryCounts[c]?.total} units</span>
          </div>
        ))}
      </div>
    </div>
  );
};
