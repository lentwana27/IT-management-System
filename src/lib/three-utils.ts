import * as THREE from 'three';
import { Asset } from '../types';

/**
 * Three.js Utility helper functions for Phase 7 Interactive 3D Dashboard
 */

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controlsGroup: THREE.Group;
  cleanup: () => void;
}

export function detectMobileGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = null; // Transparent background to blend with dark UI
  return scene;
}

export function createCamera(width: number, height: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 5, 25);
  camera.lookAt(0, 0, 0);
  return camera;
}

export function createRenderer(width: number, height: number): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  return renderer;
}

export function addSceneLighting(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x2dd4bf, 3);
  mainLight.position.set(15, 20, 15);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const secondaryLight = new THREE.PointLight(0x818cf8, 4, 60);
  secondaryLight.position.set(-15, -10, 15);
  scene.add(secondaryLight);

  const accentLight = new THREE.PointLight(0xf43f5e, 3, 40);
  accentLight.position.set(0, -15, -10);
  scene.add(accentLight);
}

/**
 * Creates custom mouse controls (Orbit drag, Wheel zoom, Right-click pan)
 */
export function setupInteractiveControls(
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  targetGroup: THREE.Group,
  onHoverNode?: (userData: any | null) => void,
  onClickNode?: (userData: any) => void
) {
  let isLeftDragging = false;
  let isRightDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) isLeftDragging = true;
    if (e.button === 2) isRightDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (isLeftDragging) {
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      targetGroup.rotation.y += deltaX * 0.008;
      targetGroup.rotation.x += deltaY * 0.008;
      prevMousePos = { x: e.clientX, y: e.clientY };
      return;
    }

    if (isRightDragging) {
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      camera.position.x -= deltaX * 0.04;
      camera.position.y += deltaY * 0.04;
      prevMousePos = { x: e.clientX, y: e.clientY };
      return;
    }

    // Hover detection
    if (onHoverNode) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(targetGroup.children, true);
      const interactiveMesh = intersects.find(hit => hit.object.userData && hit.object.userData.title);
      if (interactiveMesh) {
        onHoverNode(interactiveMesh.object.userData);
      } else {
        onHoverNode(null);
      }
    }
  };

  const handleMouseUp = () => {
    isLeftDragging = false;
    isRightDragging = false;
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.02, 6, 45);
  };

  const handleClick = (e: MouseEvent) => {
    if (isLeftDragging || isRightDragging) return;
    if (onClickNode) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(targetGroup.children, true);
      const hit = intersects.find(h => h.object.userData && h.object.userData.id);
      if (hit) onClickNode(hit.object.userData);
    }
  };

  const handleContextMenu = (e: MouseEvent) => e.preventDefault();

  container.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  container.addEventListener('wheel', handleWheel, { passive: false });
  container.addEventListener('click', handleClick);
  container.addEventListener('contextmenu', handleContextMenu);

  return () => {
    container.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    container.removeEventListener('wheel', handleWheel);
    container.removeEventListener('click', handleClick);
    container.removeEventListener('contextmenu', handleContextMenu);
  };
}

/**
 * Creates 3D representation geometry based on asset category shape
 */
export function createAssetShape(category: string, status: string): THREE.Mesh {
  let geo: THREE.BufferGeometry;
  const lower = category.toLowerCase();

  if (lower.includes('laptop')) {
    geo = new THREE.BoxGeometry(1.2, 0.15, 0.9); // Flat rectangle
  } else if (lower.includes('desktop') || lower.includes('server')) {
    geo = new THREE.BoxGeometry(0.7, 1.6, 1.4); // Tall tower
  } else if (lower.includes('monitor') || lower.includes('display')) {
    geo = new THREE.BoxGeometry(1.4, 0.9, 0.1); // Screen shape
  } else if (lower.includes('phone') || lower.includes('mobile')) {
    geo = new THREE.BoxGeometry(0.4, 0.8, 0.1); // Small phone
  } else if (lower.includes('printer')) {
    geo = new THREE.BoxGeometry(1.2, 1.0, 1.2); // Box shape
  } else {
    geo = new THREE.OctahedronGeometry(0.7); // POS / Generic
  }

  let color = 0x10b981; // Green active
  if (status === 'REPAIR' || status === 'DAMAGED') color = 0xf43f5e; // Red repair
  if (status === 'STORAGE') color = 0xf59e0b; // Yellow warning

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.3,
    metalness: 0.6,
    emissive: color,
    emissiveIntensity: status === 'REPAIR' ? 0.5 : 0.15
  });

  return new THREE.Mesh(geo, mat);
}

/**
 * Creates canvas texture sprite label for 3D tooltips/branch markers
 */
export function createTextSprite(text: string, subtext?: string, bgColor = '#0f172a'): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgColor;
  ctx.strokeStyle = '#2dd4bf';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 236, 32);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 256, 110);

  if (subtext) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '34px monospace';
    ctx.fillText(subtext, 256, 180);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(3.5, 1.75, 1);
  return sprite;
}

export function exportCanvasScreenshot(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, title = '3D_Dashboard_View') {
  renderer.render(scene, camera);
  const dataURL = renderer.domElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${title}_${new Date().toISOString().split('T')[0]}.png`;
  link.href = dataURL;
  link.click();
}
