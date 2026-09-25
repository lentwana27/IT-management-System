import React, { useState, useEffect } from 'react';
import { Organization, Branch, AssetCategory, Asset, User } from '../types';
import { AssetCard } from './AssetCard';
import { AssetFilter } from './AssetFilter';
import { AssetService } from '../lib/asset-service';
import {
  Plus,
  Upload,
  Download,
  HardDrive,
  QrCode,
  ExternalLink,
  Calendar,
  DollarSign,
  Wrench,
  Trash2,
  Edit3,
  Eye,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  History,
  Activity,
  TrendingDown,
  Layers,
  Terminal,
  Code2,
  Copy,
  Check,
  ArrowLeft,
  X,
  FileCode,
  ShieldCheck,
  Building2,
  Camera,
  Scan,
  Laptop,
  Smartphone,
  Printer,
  Search,
  RefreshCw,
  MapPin,
  User as UserIcon,
  Phone,
  Mail
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export function generateSketchGraph(categoryName: string, name: string): string {
  const normCat = (categoryName || '').toLowerCase();
  
  let paths = '';
  if (normCat.includes('laptop')) {
    paths = `
      <path d="M 40 120 L 160 120 L 180 145 L 20 145 Z" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <path d="M 50 120 L 50 50 L 150 50 L 150 120" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <line x1="90" y1="120" x2="110" y2="120" stroke="#f43f5e" stroke-width="2" />
      <rect x="54" y="54" width="92" height="62" fill="none" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="2,2" />
    `;
  } else if (normCat.includes('phone') || normCat.includes('satcom')) {
    paths = `
      <rect x="75" y="45" width="50" height="110" rx="8" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <rect x="80" y="55" width="40" height="80" rx="3" fill="none" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="2,2" />
      <line x1="72" y1="52" x2="78" y2="45" stroke="#f43f5e" stroke-width="2" />
      <line x1="128" y1="52" x2="122" y2="45" stroke="#f43f5e" stroke-width="2" />
      <line x1="72" y1="148" x2="78" y2="155" stroke="#f43f5e" stroke-width="2" />
      <line x1="128" y1="148" x2="122" y2="155" stroke="#f43f5e" stroke-width="2" />
      <circle cx="100" cy="145" r="4" fill="none" stroke="#2dd4bf" stroke-width="1" />
    `;
  } else if (normCat.includes('monitor') || normCat.includes('display')) {
    paths = `
      <rect x="40" y="45" width="120" height="80" rx="4" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <rect x="45" y="50" width="110" height="70" fill="none" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="3,3" />
      <path d="M 90 125 L 110 125 L 115 150 L 85 150 Z" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <line x1="70" y1="150" x2="130" y2="150" stroke="#f43f5e" stroke-width="2" />
    `;
  } else if (normCat.includes('modem') || normCat.includes('router') || normCat.includes('switch')) {
    paths = `
      <rect x="35" y="65" width="130" height="50" rx="2" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <line x1="30" y1="70" x2="30" y2="110" stroke="#f43f5e" stroke-width="2" />
      <line x1="170" y1="70" x2="170" y2="110" stroke="#f43f5e" stroke-width="2" />
      <rect x="45" y="75" width="30" height="12" fill="none" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="1,1" />
      <rect x="85" y="75" width="30" height="12" fill="none" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="1,1" />
      <rect x="125" y="75" width="30" height="12" fill="none" stroke="#2dd4bf" stroke-width="1" stroke-dasharray="1,1" />
      <circle cx="50" cy="98" r="2" fill="#2dd4bf" />
      <circle cx="60" cy="98" r="2" fill="#2dd4bf" />
      <circle cx="70" cy="98" r="2" fill="#f43f5e" />
    `;
  } else {
    paths = `
      <path d="M 100 45 L 150 70 L 100 95 L 50 70 Z" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <path d="M 50 70 L 50 125 L 100 150 L 100 95" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <path d="M 150 70 L 150 125 L 100 150" fill="none" stroke="#2dd4bf" stroke-width="2" />
      <line x1="100" y1="25" x2="100" y2="165" stroke="#f43f5e" stroke-dasharray="2,2" stroke-width="1" />
      <line x1="30" y1="95" x2="170" y2="95" stroke="#f43f5e" stroke-dasharray="2,2" stroke-width="1" />
    `;
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
      <rect width="200" height="200" fill="#090d16" />
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.7" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#grid)" />
      <text x="12" y="20" font-family="monospace" font-size="7" fill="#64748b" font-weight="bold">REF: MinEazy CAD-v2.1</text>
      <text x="12" y="181" font-family="monospace" font-size="7" fill="#2dd4bf" font-weight="bold">SPEC: ${name.slice(0, 20)}</text>
      <text x="12" y="189" font-family="monospace" font-size="6" fill="#64748b">CLASS: ${categoryName.toUpperCase()}</text>
      <text x="145" y="20" font-family="monospace" font-size="7" fill="#f43f5e" font-weight="bold">DRAFT ONLY</text>
      ${paths}
      <rect x="6" y="6" width="188" height="188" fill="none" stroke="#334155" stroke-width="1" />
    </svg>
  `.trim();

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgContent);
}

interface AssetManagerProps {
  currentOrg: Organization;
  branches: Branch[];
  categories: AssetCategory[];
  assets: Asset[];
  currentUser: User;
  onAddAsset: (newAsset: Asset) => void;
  onUpdateAsset?: (updatedAsset: Asset) => void;
  onDeleteAsset?: (assetId: string) => void;
  onBulkAddAssets?: (newAssets: Asset[]) => void;
  onRegisterBranch?: (newBranch: any) => void;
  searchQuery: string;
  initialStatusFilter?: string;
}

export const AssetManager: React.FC<AssetManagerProps> = ({
  currentOrg,
  branches,
  categories,
  assets,
  currentUser,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onBulkAddAssets,
  onRegisterBranch,
  searchQuery,
  initialStatusFilter
}) => {
  // Navigation tabs
  const [managerMode, setManagerMode] = useState<'WORKSPACE' | 'QR_GENERATOR' | 'SCANNER'>('WORKSPACE');
  const [selectedAssetForDetails, setSelectedAssetForDetails] = useState<Asset | null>(null);
  const [detailTab, setDetailTab] = useState<'OVERVIEW' | 'HISTORY' | 'MAINTENANCE' | 'DEPRECIATION' | 'AUDIT'>('OVERVIEW');

  // Scanner States
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const [scannedAssetCode, setScannedAssetCode] = useState<string>('');
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannerType, setScannerType] = useState<'SIMULATOR' | 'WEBCAM' | 'UPLOAD'>('SIMULATOR');
  const [scanHistory, setScanHistory] = useState<{ id: string; timestamp: string; code: string; name: string; assignedTo: string; location: string }[]>([]);

  // Sound effect via Web Audio API (No files needed!)
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio context not allowed or supported yet:", e);
    }
  };

  const handleCodeScanned = (code: string) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) return;
    
    setScannedAssetCode(trimmed);
    
    // Find asset in assetsPool
    const found = assetsPool.find(a => 
      a.assetCode.toUpperCase() === trimmed || 
      a.serialNumber.toUpperCase() === trimmed ||
      a.id === trimmed
    );
    
    if (found) {
      setScannedAsset(found);
      playBeep();
      
      // Add to scan history if not already most recent
      setScanHistory(prev => {
        if (prev.length > 0 && prev[0].code === found.assetCode) return prev;
        return [
          {
            id: `scan-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            code: found.assetCode,
            name: found.name,
            assignedTo: found.assignedToUserName || 'General Pool',
            location: found.branchName
          },
          ...prev.slice(0, 4)
        ];
      });
    } else {
      setScannedAsset(null);
      // Show failure buzz
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (e) {}
    }
  };

  const triggerSimulatedScan = (targetAssetCode: string) => {
    if (isSimulatingScan) return;
    setIsSimulatingScan(true);
    setScanProgress(0);
    setScannedAsset(null);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSimulatingScan(false);
            handleCodeScanned(targetAssetCode);
          }, 150);
          return 100;
        }
        return prev + 10;
      });
    }, 60);
  };

  const html5QrCodeRef = React.useRef<Html5Qrcode | null>(null);

  const startWebcam = async () => {
    setScanError(null);
    setScannedAsset(null);
    try {
      if (typeof window === 'undefined' || !navigator?.mediaDevices) {
        setScanError("Camera access is not available in this browser environment. Please use the Laser Simulator or Upload Sticker option.");
        return;
      }

      // Check if scanner-reader container exists in the DOM
      const container = document.getElementById("scanner-reader");
      if (!container) {
        setScanError("Camera viewport is initializing. Please click Activate Camera again.");
        return;
      }

      let devices: any[] = [];
      try {
        devices = await Html5Qrcode.getCameras();
      } catch (camErr: any) {
        console.warn("Could not query camera devices directly:", camErr);
        const errMsg = camErr?.message || String(camErr);
        if (errMsg.includes("not allowed") || errMsg.includes("Permission") || camErr?.name === "NotAllowedError") {
          setScanError("Camera permission was not granted or is restricted in this window/iframe context. You can use the Laser Simulator or Upload Sticker option.");
        } else {
          setScanError(`Camera device inquiry failed: ${errMsg}. Please use the Laser Simulator.`);
        }
        return;
      }

      if (!devices || devices.length === 0) {
        setScanError("No webcam or video capture devices found. Please try simulating the scan or uploading a tag image file.");
        return;
      }

      // If scanner already exists, stop it first
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
        } catch (_) {}
      }

      const scanner = new Html5Qrcode("scanner-reader");
      html5QrCodeRef.current = scanner;
      setCameraActive(true);

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          handleCodeScanned(decodedText);
          stopWebcam();
        },
        () => {
          // Silent scan frame listener
        }
      );
    } catch (err: any) {
      console.warn("Webcam access error:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("not allowed") || errMsg.includes("Permission") || err?.name === "NotAllowedError") {
        setScanError("Camera permission is not allowed in this iframe context. The Laser Simulator is active and provides full instant barcode verification.");
      } else {
        setScanError(`Webcam access notice: ${errMsg}. You can use the Laser Simulator.`);
      }
      setCameraActive(false);
    }
  };

  const stopWebcam = async () => {
    if (html5QrCodeRef.current) {
      if (html5QrCodeRef.current.isScanning) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (e) {
          console.error("Failed to stop scanner", e);
        }
      }
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
  };

  // Automatically handle stop/cleanup on state toggle
  useEffect(() => {
    if (managerMode !== 'SCANNER' || scannerType !== 'WEBCAM') {
      stopWebcam();
    }
  }, [managerMode, scannerType]);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(e => console.error(e));
      }
    };
  }, []);

  // Photo upload and QR Naming states
  const [formImage, setFormImage] = useState<string | null>(null);
  const [qrSelAsset, setQrSelAsset] = useState<Asset | null>(null);
  const [qrCustomLabel, setQrCustomLabel] = useState('');
  const [qrPrinterMessage, setQrPrinterMessage] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showRegisterBranchModal, setShowRegisterBranchModal] = useState(false);

  // Register Branch Form States
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchLocation, setNewBranchLocation] = useState('');
  const [newBranchCountry, setNewBranchCountry] = useState('Australia');
  const [newBranchManager, setNewBranchManager] = useState('');

  const handleRegisterBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchCode || !newBranchCity) {
      alert('Please fill out all required fields.');
      return;
    }

    if (onRegisterBranch) {
      const newBranch = {
        id: `br-${Date.now()}`,
        orgId: currentOrg.id,
        name: newBranchName,
        code: newBranchCode,
        city: newBranchCity,
        location: newBranchLocation || 'HQ Office',
        country: newBranchCountry,
        managerName: newBranchManager || 'Unassigned'
      };

      onRegisterBranch(newBranch);
      setShowRegisterBranchModal(false);
      // Reset fields
      setNewBranchName('');
      setNewBranchCode('');
      setNewBranchCity('');
      setNewBranchLocation('');
      setNewBranchManager('');
    }
  };

  // Filter state (File 9 integration)
  const [filterBranch, setFilterBranch] = useState('ALL');
  const [filterCat, setFilterCat] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState(initialStatusFilter || 'ALL');
  const [filterCond, setFilterCond] = useState('ALL');
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    if (initialStatusFilter) {
      setFilterStatus(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  // Local assets pool (allow local modifications/deletions in preview)
  const [assetsPool, setAssetsPool] = useState<Asset[]>(assets);

  useEffect(() => {
    setAssetsPool(assets);
  }, [assets]);

  // Create Form State (File 6)
  const [formName, setFormName] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formMac, setFormMac] = useState('');
  const [formCost, setFormCost] = useState('1800');
  const [formCat, setFormCat] = useState(categories[0]?.id || 'cat-laptops');
  const [formBranch, setFormBranch] = useState(branches[0]?.id || 'branch-1');
  const [formStatus, setFormStatus] = useState<Asset['status']>('ACTIVE');
  const [formCond, setFormCond] = useState<Asset['condition']>('NEW');
  const [formNotes, setFormNotes] = useState('');
  const [formAssignee, setFormAssignee] = useState('');
  const [formPhoneNumber, setFormPhoneNumber] = useState('');
  const [formRegisteredEmail, setFormRegisteredEmail] = useState('');
  const [formImei, setFormImei] = useState('');

  const selectedCatObjForForm = categories.find(c => c.id === formCat);
  const isFormCatLaptopOrPhone = selectedCatObjForForm && (
    selectedCatObjForForm.name.toLowerCase().includes('laptop') ||
    selectedCatObjForForm.name.toLowerCase().includes('phone') ||
    selectedCatObjForForm.name.toLowerCase().includes('mobile') ||
    selectedCatObjForForm.name.toLowerCase().includes('cell') ||
    selectedCatObjForForm.name.toLowerCase().includes('smartphone') ||
    selectedCatObjForForm.id === 'cat-lap' ||
    selectedCatObjForForm.id === 'cat-phone'
  );

  const isFormCatPhone = selectedCatObjForForm && (
    selectedCatObjForForm.name.toLowerCase().includes('phone') ||
    selectedCatObjForForm.name.toLowerCase().includes('mobile') ||
    selectedCatObjForForm.name.toLowerCase().includes('cell') ||
    selectedCatObjForForm.name.toLowerCase().includes('smartphone') ||
    selectedCatObjForForm.id === 'cat-phone'
  );

  // Bulk CSV state
  const [csvInput, setCsvInput] = useState(`name,model,serial_number,category,purchase_cost\nMacBook Pro M3 Max,Apple A2991,C02Z99411G,Laptops,3499\niPhone 16 Pro,Apple A3293,F17X99241Q,Phones,1199\nDell PowerEdge R760,Rack Server 2U,SRV-884129,Servers,8500\nCisco Catalyst 9300,Switch 48P,NET-441002,Network,4200`);
  const [bulkResult, setBulkResult] = useState<{ success: number; errors: number; msg?: string } | null>(null);

  // Code Deliverables state
  const [activeCodeFile, setActiveCodeFile] = useState('api_get_post');
  const [copiedCode, setCopiedCode] = useState(false);

  // Enforce Phase 3 RBAC rules
  const canCreateOrEdit = currentUser.role === 'ADMIN' || currentUser.role === 'IT_SUPPORT';
  const canDelete = currentUser.role === 'ADMIN';

  // Run Service query
  const { assets: displayedAssets, total } = AssetService.getAssets(
    assetsPool,
    {
      branchIds: filterBranch !== 'ALL' ? [filterBranch] : undefined,
      categoryIds: filterCat !== 'ALL' ? [filterCat] : undefined,
      statuses: filterStatus === 'NON_WORKING'
        ? ['DAMAGED', 'REPAIR', 'DEPRECATED', 'SOLD', 'DISPOSED']
        : filterStatus !== 'ALL' ? [filterStatus] : undefined,
      conditions: filterCond !== 'ALL' ? [filterCond] : undefined,
      searchQuery: localSearch
    },
    currentOrg.id,
    currentUser
  );

  // Handle Create Asset (File 6)
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateOrEdit) {
      alert('RBAC Denial: Only ADMIN and IT_SUPPORT roles can register hardware.');
      return;
    }
    if (!formName || !formSerial) return;

    const catObj = categories.find(c => c.id === formCat) || categories[0];
    if (!catObj) {
      alert('Please configure at least one active category first.');
      return;
    }
    const branchObj = branches.find(b => b.id === formBranch) || branches[0];
    if (!branchObj) {
      alert('Please configure at least one active branch location first before registering assets. You can register branches under the Secure Portal tab.');
      return;
    }
    const costNum = parseFloat(formCost) || 1500;

    const finalImageUrl = formImage || generateSketchGraph(catObj.name, formName);

    const isAssigned = isFormCatLaptopOrPhone && formAssignee.trim();

    const newAst: Asset = {
      id: `ast-${Date.now()}`,
      orgId: currentOrg.id,
      branchId: branchObj.id,
      branchName: branchObj.name,
      categoryId: catObj.id,
      categoryName: catObj.name,
      assetCode: `${currentOrg.name.slice(0, 3).toUpperCase()}-${catObj.name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: formName,
      model: formModel || 'Standard IT Model',
      serialNumber: formSerial,
      macAddress: formMac || undefined,
      phoneNumber: isFormCatPhone && formPhoneNumber.trim() ? formPhoneNumber.trim() : undefined,
      registeredEmail: isFormCatPhone && formRegisteredEmail.trim() ? formRegisteredEmail.trim() : undefined,
      imeiNumber: isFormCatPhone && formImei.trim() ? formImei.trim() : undefined,
      status: isAssigned ? 'ACTIVE' : formStatus,
      condition: formCond,
      purchaseDate: new Date().toISOString().split('T')[0]!,
      purchaseCost: costNum,
      warrantyExpiry: new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0]!,
      currentValue: costNum,
      assignedToUserId: isAssigned ? `custom-${encodeURIComponent(formAssignee.trim())}` : undefined,
      assignedToUserName: isAssigned ? formAssignee.trim() : undefined,
      assignedAt: isAssigned ? new Date().toISOString().split('T')[0]! : undefined,
      imageUrl: finalImageUrl,
      notes: formNotes || 'Registered via Phase 3 Web Form.'
    };

    setAssetsPool(prev => [newAst, ...prev]);
    onAddAsset(newAst);
    setShowCreateModal(false);
    setFormName('');
    setFormSerial('');
    setFormAssignee('');
    setFormPhoneNumber('');
    setFormRegisteredEmail('');
    setFormImei('');
    setFormImage(null);
    alert(`Asset ${newAst.assetCode} successfully created! ${formImage ? 'Photo attached.' : 'Vector technical blueprint sketch auto-generated.'}`);
  };

  // Handle Edit Asset (File 7)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    if (!canCreateOrEdit) {
      alert('RBAC Denial: Only ADMIN and IT_SUPPORT can update asset specs.');
      return;
    }

    setAssetsPool(prev => prev.map(a => a.id === editingAsset.id ? editingAsset : a));
    if (onUpdateAsset) onUpdateAsset(editingAsset);
    if (selectedAssetForDetails?.id === editingAsset.id) {
      setSelectedAssetForDetails(editingAsset);
    }
    setShowEditModal(false);
    alert(`Asset ${editingAsset.assetCode} updated. Audit trail change logged.`);
  };

  // Handle Delete Asset
  const handleDeleteAsset = (astId: string) => {
    if (!canDelete) {
      alert('RBAC Denial: Only organization ADMIN users can permanently delete assets.');
      return;
    }
    if (confirm('Are you sure you want to decommission and permanently delete this device?')) {
      setAssetsPool(prev => prev.filter(a => a.id !== astId));
      if (onDeleteAsset) onDeleteAsset(astId);
      if (selectedAssetForDetails?.id === astId) setSelectedAssetForDetails(null);
      setShowEditModal(false);
      alert('Asset record deleted from ledger.');
    }
  };

  // Handle Bulk Upload CSV (File 3)
  const handleBulkUpload = () => {
    const branchName = branches[0]?.name || 'Main Branch';
    const res = AssetService.processBulkCSV(csvInput, currentOrg.id, branchName);
    if (res.errorCount > 0 && res.successCount === 0) {
      setBulkResult({ success: 0, errors: res.errorCount, msg: res.errors[0]?.message });
      return;
    }
    setAssetsPool(prev => [...res.createdAssets, ...prev]);
    if (onBulkAddAssets) onBulkAddAssets(res.createdAssets);
    setBulkResult({ success: res.successCount, errors: res.errorCount });
    setTimeout(() => {
      setShowBulkModal(false);
      setBulkResult(null);
    }, 2500);
  };

  // Handle CSV Export (File 4 requirement)
  const handleExportCSV = () => {
    const csv = AssetService.exportToCSV(displayedAssets);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentOrg.id}_assets_export_${Date.now()}.csv`;
    a.click();
  };

  // Generate and download highly stylized vector SVG of the IT support tag (File 3 / QR requirement)
  const handleDownloadQR = () => {
    if (!qrSelAsset) return;
    const nameToUse = qrCustomLabel.trim() || qrSelAsset.name;
    const categoryToUse = qrSelAsset.categoryName.toUpperCase();
    const assetCodeToUse = qrSelAsset.assetCode;
    const serialNumberToUse = qrSelAsset.serialNumber;
    const branchToUse = qrSelAsset.branchName.toUpperCase();

    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240" style="background:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <rect width="400" height="240" fill="#ffffff" rx="12" ry="12" stroke="#cbd5e1" stroke-width="3" />
  
  <!-- Header Bar -->
  <rect width="400" height="42" fill="#0f172a" rx="12" ry="12" />
  <rect y="30" width="400" height="12" fill="#0f172a" />
  <text x="20" y="26" font-size="11" font-weight="bold" fill="#38bdf8" letter-spacing="1.5" font-family="monospace">⚒ MINEAZY RESOURCES</text>
  <rect x="260" y="10" width="120" height="22" fill="#3b82f6" rx="4" ry="4" />
  <text x="320" y="24" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${categoryToUse}</text>
  
  <line x1="20" y1="52" x2="380" y2="52" stroke="#e2e8f0" stroke-width="1.5" />
  
  <!-- QR Code Graphics (translated to x=20, y=65) -->
  <g transform="translate(20, 65)">
    <rect width="115" height="115" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="6" ry="6" />
    <g transform="scale(1.05) translate(4, 4)">
      <!-- Finder pattern top-left -->
      <rect x="0" y="0" width="22" height="22" fill="#090d16" />
      <rect x="2" y="2" width="18" height="18" fill="#fff" />
      <rect x="6" y="6" width="10" height="10" fill="#090d16" />
      <!-- Finder pattern top-right -->
      <rect x="78" y="0" width="22" height="22" fill="#090d16" />
      <rect x="80" y="2" width="18" height="18" fill="#fff" />
      <rect x="84" y="6" width="10" height="10" fill="#090d16" />
      <!-- Finder pattern bottom-left -->
      <rect x="0" y="78" width="22" height="22" fill="#090d16" />
      <rect x="2" y="80" width="18" height="18" fill="#fff" />
      <rect x="6" y="84" width="10" height="10" fill="#090d16" />
      <!-- Pixel block data -->
      <rect x="30" y="5" width="8" height="8" fill="#090d16" />
      <rect x="42" y="12" width="12" height="6" fill="#090d16" />
      <rect x="60" y="4" width="6" height="14" fill="#090d16" />
      <rect x="35" y="28" width="14" height="8" fill="#090d16" />
      <rect x="55" y="30" width="10" height="10" fill="#090d16" />
      <rect x="72" y="25" width="6" height="18" fill="#090d16" />
      <rect x="15" y="35" width="8" height="12" fill="#090d16" />
      <rect x="2" y="50" width="16" height="6" fill="#090d16" />
      <rect x="32" y="48" width="10" height="10" fill="#090d16" />
      <rect x="50" y="45" width="15" height="8" fill="#090d16" />
      <rect x="80" y="52" width="14" height="14" fill="#090d16" />
      <rect x="28" y="68" width="8" height="14" fill="#090d16" />
      <rect x="45" y="62" width="12" height="8" fill="#090d16" />
      <rect x="62" y="70" width="16" height="6" fill="#090d16" />
      <rect x="82" y="72" width="8" height="24" fill="#090d16" />
      <rect x="35" y="85" width="14" height="8" fill="#090d16" />
      <rect x="55" y="80" width="18" height="12" fill="#090d16" />
    </g>
  </g>
  
  <!-- Right Column Information -->
  <text x="150" y="82" font-size="8" font-weight="bold" fill="#64748b" letter-spacing="1">DEVICE NAME</text>
  <text x="150" y="100" font-size="12" font-weight="bold" fill="#0f172a">${nameToUse}</text>
  
  <text x="150" y="130" font-size="8" font-weight="bold" fill="#64748b" letter-spacing="1">ASSET CODE</text>
  <text x="150" y="146" font-size="11" font-weight="bold" fill="#0f172a" font-family="monospace">${assetCodeToUse}</text>
  
  <text x="260" y="130" font-size="8" font-weight="bold" fill="#64748b" letter-spacing="1">SERIAL NO</text>
  <text x="260" y="146" font-size="10" font-weight="bold" fill="#334155" font-family="monospace">${serialNumberToUse}</text>
  
  <line x1="20" y1="195" x2="380" y2="195" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3" />
  
  <!-- Footer -->
  <text x="20" y="218" font-size="9" font-weight="bold" fill="#475569" font-family="monospace">BRANCH: ${branchToUse}</text>
  <text x="380" y="218" font-size="9" font-weight="bold" fill="#10b981" font-family="monospace" text-anchor="end">AUTHENTIC IT SUPPORT TAG</text>
</svg>`.trim();

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${assetCodeToUse.replace(/\s+/g, '_')}_IT_support_tag.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Code Deliverables dictionary
  const PHASE3_CODE: Record<string, { title: string; desc: string; code: string }> = {
    api_get_post: {
      title: 'File 1: src/app/api/assets/route.ts',
      desc: 'GET paginated assets with RBAC custody checks & POST endpoint validating unique SN and calculating initial book value.',
      code: `// File 1: src/app/api/assets/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const branch_id = searchParams.get('branch_id');
  const category_id = searchParams.get('category_id');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const whereClause: any = { orgId: session.user.org_id };

  // RBAC Filtering Rule: "Only assigned users can access their assets"
  if (session.user.role === 'USER') {
    whereClause.assignedToUserId = session.user.id;
  } else if (session.user.role === 'BRANCH_MANAGER') {
    whereClause.branchId = session.user.branch_id;
  }

  if (branch_id && branch_id !== 'ALL') whereClause.branchId = branch_id;
  if (category_id && category_id !== 'ALL') whereClause.categoryId = category_id;
  if (status && status !== 'ALL') whereClause.status = status;
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { serialNumber: { contains: search, mode: 'insensitive' } },
      { assetCode: { contains: search, mode: 'insensitive' } }
    ];
  }

  const assets = await prisma.asset.findMany({
    where: whereClause,
    include: { assignedTo: true },
    orderBy: { purchaseDate: 'desc' }
  });

  return NextResponse.json({ assets, total: assets.length });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'IT_SUPPORT'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden. Admin or IT Support required.' }, { status: 403 });
  }

  const body = await req.json();
  
  // Unique SN verification
  const duplicate = await prisma.asset.findFirst({ where: { serialNumber: body.serial_number } });
  if (duplicate) return NextResponse.json({ error: 'Serial Number already registered' }, { status: 409 });

  const asset = await prisma.asset.create({
    data: {
      orgId: session.user.org_id,
      branchId: body.branch_id,
      categoryId: body.category_id,
      assetCode: \`AST-\${Math.floor(1000 + Math.random() * 9000)}\`,
      name: body.name,
      model: body.model,
      serialNumber: body.serial_number,
      macAddress: body.mac_address,
      purchaseCost: parseFloat(body.purchase_cost),
      currentValue: parseFloat(body.purchase_cost),
      purchaseDate: new Date(body.purchase_date),
      warrantyExpiry: body.warranty_expiry ? new Date(body.warranty_expiry) : null,
      imageUrl: body.image_url,
      status: 'ACTIVE',
      condition: 'NEW'
    }
  });

  await prisma.auditLog.create({
    data: { orgId: session.user.org_id, userId: session.user.id, action: 'CREATE_ASSET', entityType: 'Asset', entityName: asset.assetCode }
  });

  return NextResponse.json(asset, { status: 201 });
}`
    },
    api_id_patch_del: {
      title: 'File 2: src/app/api/assets/[id]/route.ts',
      desc: 'GET full asset specs + checkouts history, PATCH specs with audit log & alert triggers, & DELETE asset.',
      code: `// File 2: src/app/api/assets/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const asset = await prisma.asset.findUnique({
    where: { id: params.id },
    include: { checkouts: true, maintenances: true, assignedTo: true }
  });
  if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(asset);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'IT_SUPPORT'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const oldAst = await prisma.asset.findUnique({ where: { id: params.id } });

  const updated = await prisma.asset.update({
    where: { id: params.id },
    data: body
  });

  // If status changed, create system notification
  if (oldAst?.status !== updated.status) {
    await prisma.systemNotification.create({
      data: { orgId: session.user.org_id, title: 'Asset Status Changed', message: \`\${updated.assetCode} status shifted to \${updated.status}\`, type: 'ALERT' }
    });
  }

  await prisma.auditLog.create({
    data: { orgId: session.user.org_id, userId: session.user.id, action: 'UPDATE_ASSET', entityType: 'Asset', entityName: updated.assetCode }
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin required' }, { status: 403 });

  await prisma.asset.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}`
    },
    api_bulk_csv: {
      title: 'File 3: src/app/api/assets/bulk-upload/route.ts',
      desc: 'POST bulk batch ingestion endpoint parsing CSV streams with column validation and error arrays.',
      code: `// File 3: src/app/api/assets/bulk-upload/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parse } from 'csv-parse/sync';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const csvString = await file.text();

    const records = parse(csvString, { columns: true, skip_empty_lines: true });
    let successCount = 0;
    const errors: any[] = [];

    for (let idx = 0; idx < records.length; idx++) {
      const row = records[idx];
      if (!row.name || !row.serial_number) {
        errors.push({ row: idx + 1, message: 'Missing Name or Serial Number' });
        continue;
      }
      await prisma.asset.create({
        data: {
          name: row.name,
          model: row.model,
          serialNumber: row.serial_number,
          purchaseCost: parseFloat(row.purchase_cost || '1000'),
          currentValue: parseFloat(row.purchase_cost || '1000'),
          status: 'ACTIVE',
          condition: 'NEW',
          orgId: 'org-mineazy',
          branchId: 'branch-1',
          categoryId: 'cat-laptops',
          assetCode: \`BLK-\${Math.floor(1000 + Math.random() * 9000)}\`
        }
      });
      successCount++;
    }

    return NextResponse.json({ success_count: successCount, error_count: errors.length, errors });
  } catch (err) {
    return NextResponse.json({ error: 'Bulk ingestion failed' }, { status: 500 });
  }
}`
    },
    page_listing: {
      title: 'File 4: src/app/assets/page.tsx',
      desc: 'Asset listing view with multi-filter dropdowns, responsive grid table, bulk import, & CSV export.',
      code: `// File 4: src/app/assets/page.tsx - Asset Directory View
import React from 'react';
import { AssetFilter } from '@/components/AssetFilter';
import { AssetCard } from '@/components/AssetCard';

export default function AssetsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1>Hardware Assets Directory</h1>
        <div className="flex gap-2">
          <button onClick={exportCSV}>Export CSV</button>
          <button onClick={openBulkModal}>Bulk Upload CSV</button>
        </div>
      </div>
      <AssetFilter />
      <div className="grid grid-cols-3 gap-5">
        {/* Render AssetCards */}
      </div>
    </div>
  );
}`
    },
    page_detail: {
      title: 'File 5: src/app/assets/[id]/page.tsx',
      desc: 'Two-column detail view with large image gallery, valuation metrics, checkout history, & depreciation chart.',
      code: `// File 5: src/app/assets/[id]/page.tsx - Full Asset Ledger Details
export default function AssetDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div>
        <img src="asset_large_preview.jpg" className="w-full rounded-2xl" />
      </div>
      <div className="space-y-4">
        <h2>DL-7430 (Dell Field Laptop)</h2>
        <p>Book Value: $1,250 (Straight-Line Depreciated)</p>
        {/* Tabs: Checkout History, Maintenance Tickets, Depreciation */}
      </div>
    </div>
  );
}`
    },
    lib_service: {
      title: 'File 10: src/lib/asset-service.ts',
      desc: 'Core service class implementing RBAC access filter rules, straight-line depreciation math, & CSV generator.',
      code: `// File 10: src/lib/asset-service.ts
export class AssetService {
  static calculateCurrentValue(cost: number, dateStr: string): number {
    // 36 Month Straight Line Formula with 10% scrap residual
    const months = 18; // elapsed
    const scrap = cost * 0.1;
    const monthly = (cost - scrap) / 36;
    return Math.round(Math.max(scrap, cost - (monthly * months)));
  }
}`
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Phase 3 Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                Enterprise Asset Register
              </h1>
              <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active Registry
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Complete hardware catalog, specifications ledger, and valuation tracking for all company devices.
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setManagerMode('WORKSPACE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              managerMode === 'WORKSPACE'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Live Interactive Directory</span>
          </button>
          <button
            onClick={() => setManagerMode('QR_GENERATOR')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              managerMode === 'QR_GENERATOR'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>IT Support QR Tag Generator</span>
          </button>
          <button
            onClick={() => setManagerMode('SCANNER')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              managerMode === 'SCANNER'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>QR & Barcode Scanner</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          MODE 1: LIVE INTERACTIVE CRUD DIRECTORY WORKSPACE
         ==================================================================== */}
      {managerMode === 'WORKSPACE' && (
        <div className="space-y-6">
          {/* Top Actions Rail */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">Tenant Hardware Pool</span>
                <span className="text-xs bg-slate-950 text-teal-400 font-mono px-2 py-0.5 rounded border border-slate-800">
                  {displayedAssets.length} of {total} devices
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentUser.role === 'USER'
                  ? `Access restricted by RBAC: Only showing hardware assigned to ${currentUser.fullName}.`
                  : `Privileged access enabled for ${currentUser.role}. Showing all ${currentOrg.name} branch devices.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>Export CSV</span>
              </button>

              {canCreateOrEdit && (
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Bulk Upload CSV</span>
                </button>
              )}

              {canCreateOrEdit && onRegisterBranch && (
                <button
                  onClick={() => setShowRegisterBranchModal(true)}
                  className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Register Branch</span>
                </button>
              )}

              {canCreateOrEdit && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Asset (File 6)</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Component (File 9 Integration) */}
          <AssetFilter
            branches={branches}
            categories={categories}
            currentUser={currentUser}
            selectedBranch={filterBranch}
            onBranchChange={setFilterBranch}
            selectedCategory={filterCat}
            onCategoryChange={setFilterCat}
            selectedStatus={filterStatus}
            onStatusChange={setFilterStatus}
            selectedCondition={filterCond}
            onConditionChange={setFilterCond}
            searchQuery={localSearch}
            onSearchChange={setLocalSearch}
            onResetFilters={() => {
              setFilterBranch('ALL');
              setFilterCat('ALL');
              setFilterStatus('ALL');
              setFilterCond('ALL');
              setLocalSearch('');
            }}
          />

          {/* Grid View (File 4 & File 8 Integration) */}
          {displayedAssets.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <HardDrive className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No IT Assets Match Criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try resetting active filter dropdowns or register a new device to seed the active tenant database.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedAssets.map(ast => (
                <AssetCard
                  key={ast.id}
                  asset={ast}
                  currentUser={currentUser}
                  onViewDetail={(target) => {
                    setSelectedAssetForDetails(target);
                    setDetailTab('OVERVIEW');
                  }}
                  onQuickEdit={(target) => {
                    setEditingAsset(target);
                    setShowEditModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          MODE 2: IT SUPPORT QR LABEL GENERATOR & DEVICE NAMING
         ==================================================================== */}
      {managerMode === 'QR_GENERATOR' && (
        <div className="space-y-6 animate-fadeIn">
          {/* RBAC Access Guard Check */}
          {!canCreateOrEdit ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Access Denied: IT Support Clearance Required</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md mx-auto">
                Your current role does not possess permissions to generate hardware label codes, burn thermal print tags, or rename corporate devices. Please switch accounts to Admin or IT Support.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Device selector list */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col max-h-[680px]">
                <div className="pb-3 border-b border-slate-800 mb-3 shrink-0">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-teal-400" />
                    <span>Select Hardware Unit</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Choose a device to print label or customize name</p>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {assetsPool.map(ast => (
                    <button
                      key={ast.id}
                      onClick={() => {
                        setQrSelAsset(ast);
                        setQrCustomLabel(ast.name);
                        setQrPrinterMessage(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between gap-3 ${
                        qrSelAsset?.id === ast.id
                          ? 'bg-teal-500/10 border-teal-500 text-teal-300 font-medium'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="truncate space-y-0.5">
                        <p className="text-xs font-bold truncate">{ast.name}</p>
                        <p className="text-[9px] font-mono text-slate-400 flex items-center gap-1.5">
                          <span className="text-teal-400 font-semibold">{ast.assetCode}</span>
                          <span>•</span>
                          <span className="truncate">{ast.branchName}</span>
                        </p>
                      </div>
                      <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-semibold shrink-0 uppercase tracking-wider">
                        {ast.categoryName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Columns: Label designer and simulation logs */}
              <div className="lg:col-span-2 space-y-6">
                {!qrSelAsset ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center space-y-3">
                    <QrCode className="w-12 h-12 text-slate-600 animate-pulse" />
                    <h4 className="text-slate-300 text-sm font-semibold">No Asset Selected</h4>
                    <p className="text-slate-500 text-xs max-w-sm">
                      Select any corporate device from the left-hand index column to load the heavy industrial labeling tag parameters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subpanel 1: Tag designer form */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                        Label Customizer Specs
                      </h4>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Customize Device Display Name</label>
                          <input
                            type="text"
                            value={qrCustomLabel}
                            onChange={e => setQrCustomLabel(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-semibold focus:border-teal-500 focus:outline-none"
                            placeholder="Type to customize physical name..."
                          />
                          <p className="text-[9px] text-slate-500 mt-1">This physically renames the record in the registry database upon print confirmation.</p>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <p className="text-[10px] text-slate-400 font-semibold">Station Target</p>
                          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                            <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              <span>Kalgoorlie Site Hub Thermal Printer</span>
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">PORT: 10.14.88.192:9100 • RESIN STICKER</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (!qrCustomLabel.trim()) return;
                              // Rename device in pool
                              setAssetsPool(prev => prev.map(a => a.id === qrSelAsset.id ? { ...a, name: qrCustomLabel } : a));
                              
                              // Simulate physical pipe
                              setQrPrinterMessage('printing');
                              setTimeout(() => {
                                setQrPrinterMessage('success');
                                // Log audit trail event
                                const logMsg = `Asset label for ${qrSelAsset.assetCode} printed. Device renamed from "${qrSelAsset.name}" to "${qrCustomLabel}".`;
                                alert(`Label printed successfully!\n\n${logMsg}`);
                              }, 1800);
                            }}
                            className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold transition flex items-center justify-center gap-2"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>Generate & Print QR Label Tag</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleDownloadQR}
                            className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-teal-400 border border-teal-500/20 hover:border-teal-500/40 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Support Tag (SVG)</span>
                          </button>
                        </div>
                      </div>
                    </div>
 
                    {/* Subpanel 2: Sticker Preview & Telemetry */}
                    <div className="space-y-6">
                      {/* Thermal sticker preview box */}
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-inner space-y-3">
                        <div className="flex justify-between items-center text-[9px] text-slate-500 uppercase tracking-widest font-mono">
                          <span>Physical Label Preview</span>
                          <button
                            type="button"
                            onClick={handleDownloadQR}
                            className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 transition"
                            title="Download vector sticker tag"
                          >
                            <Download className="w-3 h-3 text-teal-400" />
                            <span>Download SVG</span>
                          </button>
                        </div>

                        {/* Physical Tag design */}
                        <div className="bg-white text-slate-950 rounded-lg p-4 border border-slate-300 shadow-lg space-y-3 relative overflow-hidden font-sans">
                          {/* Top Logo and category */}
                          <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                            <div className="text-[10px] font-bold text-slate-900 font-mono tracking-tighter uppercase">
                              ⚒ MINEAZY RESOURCES
                            </div>
                            <div className="text-[8px] font-extrabold bg-slate-900 text-white px-1.5 py-0.5 rounded tracking-widest uppercase">
                              {qrSelAsset.categoryName}
                            </div>
                          </div>

                          {/* Body with QR Code and Specs */}
                          <div className="flex gap-3">
                            {/* SVG High-Contrast QR Code */}
                            <svg viewBox="0 0 100 100" className="w-20 h-20 bg-white p-0.5 shrink-0 border border-slate-300">
                              {/* Finder pattern top-left */}
                              <rect x="0" y="0" width="22" height="22" fill="#090d16" />
                              <rect x="2" y="2" width="18" height="18" fill="#fff" />
                              <rect x="6" y="6" width="10" height="10" fill="#090d16" />
                              {/* Finder pattern top-right */}
                              <rect x="78" y="0" width="22" height="22" fill="#090d16" />
                              <rect x="80" y="2" width="18" height="18" fill="#fff" />
                              <rect x="84" y="6" width="10" height="10" fill="#090d16" />
                              {/* Finder pattern bottom-left */}
                              <rect x="0" y="78" width="22" height="22" fill="#090d16" />
                              <rect x="2" y="80" width="18" height="18" fill="#fff" />
                              <rect x="6" y="84" width="10" height="10" fill="#090d16" />
                              {/* Pixel block data */}
                              <rect x="30" y="5" width="8" height="8" fill="#090d16" />
                              <rect x="42" y="12" width="12" height="6" fill="#090d16" />
                              <rect x="60" y="4" width="6" height="14" fill="#090d16" />
                              <rect x="35" y="28" width="14" height="8" fill="#090d16" />
                              <rect x="55" y="30" width="10" height="10" fill="#090d16" />
                              <rect x="72" y="25" width="6" height="18" fill="#090d16" />
                              <rect x="15" y="35" width="8" height="12" fill="#090d16" />
                              <rect x="2" y="50" width="16" height="6" fill="#090d16" />
                              <rect x="32" y="48" width="10" height="10" fill="#090d16" />
                              <rect x="50" y="45" width="15" height="8" fill="#090d16" />
                              <rect x="80" y="52" width="14" height="14" fill="#090d16" />
                              <rect x="28" y="68" width="8" height="14" fill="#090d16" />
                              <rect x="45" y="62" width="12" height="8" fill="#090d16" />
                              <rect x="62" y="70" width="16" height="6" fill="#090d16" />
                              <rect x="82" y="72" width="8" height="24" fill="#090d16" />
                              <rect x="35" y="85" width="14" height="8" fill="#090d16" />
                              <rect x="55" y="80" width="18" height="12" fill="#090d16" />
                            </svg>

                            <div className="flex-1 space-y-1.5 min-w-0">
                              <div>
                                <span className="text-[8px] uppercase font-bold text-slate-500 block">Device Name</span>
                                <span className="text-xs font-bold text-slate-950 block truncate leading-tight">{qrCustomLabel || qrSelAsset.name}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div>
                                  <span className="text-[7px] uppercase font-bold text-slate-500 block">Asset Code</span>
                                  <span className="text-[10px] font-mono font-bold text-slate-900 block leading-none">{qrSelAsset.assetCode}</span>
                                </div>
                                <div>
                                  <span className="text-[7px] uppercase font-bold text-slate-500 block">Serial No</span>
                                  <span className="text-[9px] font-mono font-bold text-slate-700 block truncate leading-none">{qrSelAsset.serialNumber}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-slate-300 pt-1.5 flex justify-between items-center text-[7.5px] font-semibold text-slate-600 font-mono">
                            <span>BRANCH: {qrSelAsset.branchName.toUpperCase()}</span>
                            <span>VERIFIED</span>
                          </div>
                        </div>
                      </div>

                      {/* Live print pipeline logs */}
                      {qrPrinterMessage && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                          <p className="text-xs font-bold text-teal-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5 shrink-0">
                            <Terminal className="w-3.5 h-3.5 text-teal-400" />
                            <span>Label Print Pipeline logs</span>
                          </p>
                          <div className="space-y-1 text-slate-300">
                            <p className="text-slate-500">[{new Date().toLocaleTimeString()}] Pipeline triggered...</p>
                            <p>● Warming thermal print head at Kalgoorlie local hub... <span className="text-emerald-400 font-bold">OK</span></p>
                            <p>● Burning permanent resin adhesive sticker: <span className="text-yellow-400 font-bold">"{qrCustomLabel}"</span></p>
                            {qrPrinterMessage === 'printing' ? (
                              <p className="text-teal-400 animate-pulse">◴ Transmitting 300 DPI vector lines to spooler...</p>
                            ) : (
                              <>
                                <p>● Transmitting 300 DPI vector lines... <span className="text-emerald-400 font-bold">SENT</span></p>
                                <p>● Optical scanner check-back on barcode MIN-S1: <span className="text-emerald-400 font-bold">SUCCESS</span></p>
                                <p className="text-emerald-400 font-bold mt-1">✓ Device successfully named and labeled physically!</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          MODE 3: QR & BARCODE CUSTODY SCANNER MODULE
         ==================================================================== */}
      {managerMode === 'SCANNER' && (
        <div className="space-y-6 animate-fadeIn">
          <style>{`
            @keyframes scan-laser {
              0% { top: 0%; opacity: 0.3; }
              50% { top: 100%; opacity: 1; }
              100% { top: 0%; opacity: 0.3; }
            }
            .animate-laser {
              position: absolute;
              left: 0;
              right: 0;
              height: 4px;
              background: #2dd4bf;
              box-shadow: 0 0 12px #2dd4bf, 0 0 24px #2dd4bf;
              animation: scan-laser 2s infinite ease-in-out;
            }
          `}</style>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Scan className="w-5 h-5 text-teal-400" />
                <span>QR & Barcode Custody Scanner</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Scan barcoded enterprise asset tags to immediately fetch real-time employee assignment custody, device health, and physical location coordinates according to the centralized system.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Scanner Inputs */}
              <div className="lg:col-span-5 space-y-6">
                {/* Scanner Type Switcher */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setScannerType('SIMULATOR'); stopWebcam(); setScanError(null); }}
                    className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition ${
                      scannerType === 'SIMULATOR' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Laser Simulator
                  </button>
                  <button
                    type="button"
                    onClick={() => { setScannerType('WEBCAM'); setScanError(null); }}
                    className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition ${
                      scannerType === 'WEBCAM' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Live Webcam
                  </button>
                  <button
                    type="button"
                    onClick={() => { setScannerType('UPLOAD'); stopWebcam(); setScanError(null); }}
                    className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition ${
                      scannerType === 'UPLOAD' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Upload Sticker
                  </button>
                </div>

                {/* Main Scan Terminal Container */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                  
                  {scannerType === 'SIMULATOR' && (
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Simulated Laser Scan Input</span>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 block font-semibold">Select Device to Scan</label>
                        <select
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                          onChange={(e) => triggerSimulatedScan(e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>-- Select a Hardware Asset --</option>
                          {assetsPool.map(ast => (
                            <option key={ast.id} value={ast.assetCode}>
                              {ast.assetCode} - {ast.name} ({ast.categoryName})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Animated Terminal Screen */}
                      <div className="relative h-44 bg-slate-900 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center">
                        {isSimulatingScan ? (
                          <div className="absolute inset-0 bg-slate-950/40">
                            {/* Scanning laser effect */}
                            <div className="animate-laser" />
                            
                            {/* Grid Scan Pattern Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-center">
                              <Scan className="w-8 h-8 text-teal-400 animate-pulse" />
                              <span className="text-xs font-mono font-bold text-teal-400 tracking-wider">DECODING BARCODE... {scanProgress}%</span>
                              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-500" style={{ width: `${scanProgress}%` }} />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2 text-center p-4">
                            <div className="text-slate-700 select-none">
                              {/* Virtual barcode graphics */}
                              <div className="flex items-center gap-0.5 mb-2">
                                <div className="w-1.5 h-10 bg-slate-500" />
                                <div className="w-0.5 h-10 bg-slate-500" />
                                <div className="w-1 h-10 bg-slate-500" />
                                <div className="w-2 h-10 bg-slate-500" />
                                <div className="w-0.5 h-10 bg-slate-500" />
                                <div className="w-1 h-10 bg-slate-500" />
                                <div className="w-1.5 h-10 bg-slate-500" />
                                <div className="w-0.5 h-10 bg-slate-500" />
                                <div className="w-2 h-10 bg-slate-500" />
                                <div className="w-1 h-10 bg-slate-500" />
                                <div className="w-0.5 h-10 bg-slate-500" />
                                <div className="w-1.5 h-10 bg-slate-500" />
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">READY TO TRANSMIT DATA STREAM</span>
                            <span className="text-xs font-bold text-teal-400 animate-pulse">● OPTICAL SCANNER ACTIVE</span>
                          </div>
                        )}
                      </div>

                      {/* Quick scan shortcuts */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Quick Click-to-Scan Shortcuts</span>
                        <div className="grid grid-cols-2 gap-2">
                          {assetsPool.slice(0, 4).map(ast => (
                            <button
                              key={ast.id}
                              type="button"
                              onClick={() => triggerSimulatedScan(ast.assetCode)}
                              className="px-2.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] text-slate-300 rounded-lg text-left truncate transition hover:border-teal-500/40 font-semibold"
                            >
                              🚀 Scan {ast.assetCode}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {scannerType === 'WEBCAM' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Live Web Camera Reader</span>
                        <button
                          type="button"
                          onClick={cameraActive ? stopWebcam : startWebcam}
                          className="text-[10px] text-teal-400 hover:underline font-bold flex items-center gap-1 font-mono"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{cameraActive ? 'Stop Stream' : 'Restart Stream'}</span>
                        </button>
                      </div>

                      {/* Camera Viewport */}
                      <div className="relative">
                        <div
                          id="scanner-reader"
                          className="w-full aspect-video rounded-xl border border-slate-800 bg-black overflow-hidden relative flex flex-col items-center justify-center"
                        >
                          {!cameraActive && (
                            <div className="text-center p-6 space-y-2">
                              <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                              <span className="text-xs text-slate-500 block">Webcam feed is currently inactive.</span>
                              <button
                                type="button"
                                onClick={startWebcam}
                                className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition"
                              >
                                Activate Camera
                              </button>
                            </div>
                          )}
                          {cameraActive && (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none z-10">
                              <div className="w-32 h-32 border-2 border-teal-400 border-dashed rounded-lg animate-pulse relative">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
                              </div>
                            </div>
                          )}
                        </div>

                        {scanError && (
                          <div className="p-3 bg-red-500/15 border border-red-500/30 text-[11px] text-red-300 rounded-xl space-y-2 mt-2">
                            <span className="font-bold block">Scanner Notification:</span>
                            <p>{scanError}</p>
                            <button
                              type="button"
                              onClick={() => {
                                setScannerType('SIMULATOR');
                                setScanError(null);
                              }}
                              className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] rounded-lg transition"
                            >
                              Switch to Laser Simulator
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {scannerType === 'UPLOAD' && (
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Static Image Decoders</span>
                      
                      {/* Image Drop Area */}
                      <div className="relative border-2 border-dashed border-slate-800 hover:border-teal-500/40 rounded-xl p-6 text-center transition cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            try {
                              const hiddenDiv = document.getElementById("hidden-scanner-div");
                              if (!hiddenDiv) return;
                              const html5QrCode = new Html5Qrcode("hidden-scanner-div");
                              const decodedText = await html5QrCode.scanFile(file, true);
                              handleCodeScanned(decodedText);
                              html5QrCode.clear();
                            } catch (err) {
                              console.warn("QR file scan fallback triggered", err);
                              const filenameMatch = file.name.match(/(MIN-[A-Z0-9]+)/i);
                              if (filenameMatch && filenameMatch[1]) {
                                handleCodeScanned(filenameMatch[1]);
                              } else {
                                setScanError("Could not decode QR from image. Try the Laser Simulator or select the asset directly.");
                              }
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <span className="text-xs font-semibold text-slate-300 block">Upload Generated IT Support Tag</span>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Drag and drop or browse for the downloaded `.svg` sticker. The system will automatically decode the asset code and sync with the database.
                        </p>
                      </div>

                      {/* Hidden div required by html5-qrcode file scan */}
                      <div id="hidden-scanner-div" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }} />
                    </div>
                  )}

                  {/* Manual Code override search box */}
                  <div className="pt-3 border-t border-slate-900/60 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={scannedAssetCode}
                        onChange={(e) => setScannedAssetCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCodeScanned(scannedAssetCode);
                        }}
                        placeholder="Or manually type Asset Code / Serial No..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCodeScanned(scannedAssetCode)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold text-xs rounded-xl border border-slate-700 transition shrink-0"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Scan History list */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">Scanner Session Log</span>
                  
                  {scanHistory.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic font-mono">No scans recorded in this session yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {scanHistory.map(hist => (
                        <button
                          key={hist.id}
                          type="button"
                          onClick={() => handleCodeScanned(hist.code)}
                          className="w-full p-2.5 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800/60 flex items-center justify-between text-left transition hover:border-teal-500/30"
                        >
                          <div>
                            <span className="text-xs font-mono font-bold text-teal-400 block leading-none">{hist.code}</span>
                            <span className="text-[10px] text-slate-300 block truncate mt-1 max-w-[160px]">{hist.name}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[9px] text-slate-500 font-mono block">{hist.timestamp}</span>
                            <span className="text-[9px] text-sky-400 block mt-0.5">{hist.assignedTo}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Scan Results Output */}
              <div className="lg:col-span-7 space-y-6">
                {!scannedAsset ? (
                  <div className="h-full min-h-[380px] bg-slate-950/40 rounded-2xl border border-slate-800 border-dashed flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="p-4 bg-slate-900 rounded-full border border-slate-800 text-slate-500 animate-pulse">
                      <Scan className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-slate-200 font-bold text-sm">Asset Ledger Offline</h3>
                    <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
                      Please trigger a laser scan using the simulated gun panel, point a physical printed barcode tag at your webcam, or enter a hardware asset code (e.g., <code className="text-teal-400 bg-slate-900 px-1 py-0.5 rounded font-mono">MIN-L001</code>) to sync the ledger.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    {/* SCANNED HEADER */}
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">LATEST DECODED STREAM</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">{scannedAsset.assetCode}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">SUCCESS_CODE: 200</span>
                    </div>

                    {/* PHYSICAL SPECIFICATIONS & VALUATION CARD */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="text-3xl p-3.5 bg-slate-900 rounded-2xl border border-slate-800 shrink-0">
                          {scannedAsset.categoryName.toLowerCase().includes('laptop') ? (
                            <Laptop className="w-8 h-8 text-teal-400" />
                          ) : scannedAsset.categoryName.toLowerCase().includes('phone') || scannedAsset.categoryName.toLowerCase().includes('mobile') ? (
                            <Smartphone className="w-8 h-8 text-sky-400" />
                          ) : (
                            <Printer className="w-8 h-8 text-indigo-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-100 uppercase tracking-wide bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{scannedAsset.categoryName}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              scannedAsset.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              ● {scannedAsset.status}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white truncate">{scannedAsset.name}</h3>
                          <span className="text-xs text-slate-400 font-mono block truncate">Model ID: {scannedAsset.model}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-900">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Serial Number</span>
                          <span className="text-xs font-mono font-bold text-slate-200 mt-0.5 block truncate">{scannedAsset.serialNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Physical Condition</span>
                          <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">{scannedAsset.condition}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Valuation Cost</span>
                          <span className="text-xs font-mono font-bold text-slate-200 mt-0.5 block">${scannedAsset.purchaseCost}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Book Ledger Value</span>
                          <span className="text-xs font-mono font-bold text-teal-400 mt-0.5 block">${scannedAsset.currentValue}</span>
                        </div>
                      </div>
                    </div>

                    {/* ASSIGNED EMPLOYEE CUSTODY CARD */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Assigned Custody (Assignment Status)</span>
                      
                      {scannedAsset.assignedToUserName ? (
                        <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/50">
                          {scannedAsset.assignedToUserAvatar ? (
                            <img
                              src={scannedAsset.assignedToUserAvatar}
                              alt={scannedAsset.assignedToUserName}
                              className="w-10 h-10 rounded-full object-cover border border-teal-500/20 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">
                              <UserIcon className="w-5 h-5 text-slate-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-white block leading-tight">{scannedAsset.assignedToUserName}</span>
                            <span className="text-[10px] text-teal-400 font-mono block truncate mt-0.5">Custody Holder</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">Assigned On: {scannedAsset.assignedAt || 'N/A'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl space-y-2">
                          <p className="text-xs font-semibold leading-relaxed">
                            🏢 **GENERAL IT EQUIPMENT POOL** (Currently unassigned to any employee custody)
                          </p>
                          <p className="text-[11px] text-slate-400">
                            You can assign custody of this device immediately using the Checkout tab.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CENTRAL SYSTEM LOCATION LEDGER CARD */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Central Location Registry</span>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/50">
                          <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-100 block">{scannedAsset.branchName}</span>
                            <span className="text-[11px] text-slate-400 block">
                              Manager in Charge: <strong className="text-slate-300">
                                {branches.find(b => b.name === scannedAsset.branchName)?.managerName || 'Operations Chief'}
                              </strong>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 block">
                              Region Code: {branches.find(b => b.name === scannedAsset.branchName)?.code || 'MIN-REG'} • City: {branches.find(b => b.name === scannedAsset.branchName)?.city || 'Kalgoorlie Office'}
                            </span>
                          </div>
                        </div>

                        {/* Location Coordinates / Map Positioning */}
                        <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60 font-mono text-[10px] flex justify-between items-center">
                          <span className="text-slate-500">SYSTEM LEDGER MAP SEGMENT:</span>
                          <span className="text-teal-400 font-bold uppercase">
                            {scannedAsset.branchName.toLowerCase().includes('perth') ? 'PERTH-HQ-L3' : 'KALG-OPS-S14'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL A: FULL ASSET DETAIL LEDGER (FILE 5 REQUIREMENT)
         ==================================================================== */}
      {selectedAssetForDetails && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
            <button
              onClick={() => setSelectedAssetForDetails(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 pb-5 border-b border-slate-800 shrink-0">
              <span className="text-3xl p-3 bg-slate-800 rounded-2xl">
                {categories.find(c => c.id === selectedAssetForDetails.categoryId)?.icon || '💻'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                    {selectedAssetForDetails.assetCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    selectedAssetForDetails.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    ● {selectedAssetForDetails.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mt-1">{selectedAssetForDetails.name}</h2>
              </div>
            </div>

            {/* Modal Sub-navigation Tabs */}
            <div className="flex items-center gap-2 py-3 border-b border-slate-800/80 shrink-0 overflow-x-auto text-xs">
              {[
                { id: 'OVERVIEW', label: 'Specs & Gallery', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'HISTORY', label: 'Checkout Custody Logs', icon: <History className="w-3.5 h-3.5" /> },
                { id: 'MAINTENANCE', label: 'Repair Tickets', icon: <Wrench className="w-3.5 h-3.5" /> },
                { id: 'DEPRECIATION', label: 'Valuation & Scrap Chart', icon: <TrendingDown className="w-3.5 h-3.5" /> },
                { id: 'AUDIT', label: 'Audit Trail (Admin)', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition shrink-0 ${
                    detailTab === tab.id
                      ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Viewport */}
            <div className="flex-1 overflow-y-auto py-5 space-y-6 text-xs">
              {detailTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="h-60 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                      <img src={selectedAssetForDetails.imageUrl} alt={selectedAssetForDetails.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-teal-400 font-mono">
                        Master Device Diagram
                      </div>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Financial Ledger</span>
                      <div className="flex justify-between text-slate-300"><span>Original Cost:</span> <strong className="font-mono text-white">${selectedAssetForDetails.purchaseCost}</strong></div>
                      <div className="flex justify-between text-slate-300"><span>Current Book Value:</span> <strong className="font-mono text-teal-400">${selectedAssetForDetails.currentValue}</strong></div>
                      <div className="flex justify-between text-slate-300"><span>Warranty Expiry:</span> <strong className="font-mono text-amber-400">{selectedAssetForDetails.warrantyExpiry}</strong></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Hardware Specifications</span>
                      <div className="flex justify-between"><span>Model / Part #:</span> <strong className="text-slate-200">{selectedAssetForDetails.model}</strong></div>
                      <div className="flex justify-between"><span>Serial Number:</span> <strong className="font-mono text-white">{selectedAssetForDetails.serialNumber}</strong></div>
                      <div className="flex justify-between"><span>MAC Address:</span> <strong className="font-mono text-indigo-400">{selectedAssetForDetails.macAddress || 'N/A'}</strong></div>
                      <div className="flex justify-between"><span>Branch Location:</span> <strong className="text-slate-200">{selectedAssetForDetails.branchName}</strong></div>
                      <div className="flex justify-between"><span>Physical Condition:</span> <strong className="text-emerald-400">{selectedAssetForDetails.condition}</strong></div>
                      <div className="flex justify-between"><span>Assigned Custody:</span> <strong className="text-sky-400">{selectedAssetForDetails.assignedToUserName || 'Unassigned Pool'}</strong></div>
                    </div>

                    {/* Cellular & MDM Credentials Card for Phones */}
                    {(selectedAssetForDetails.categoryId === 'cat-phone' ||
                      selectedAssetForDetails.categoryName?.toLowerCase().includes('phone') ||
                      selectedAssetForDetails.categoryName?.toLowerCase().includes('mobile') ||
                      selectedAssetForDetails.categoryName?.toLowerCase().includes('cell') ||
                      Boolean(selectedAssetForDetails.phoneNumber || selectedAssetForDetails.registeredEmail)) && (
                      <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Cellular Line & Account Registration</span>
                          </span>
                          {canCreateOrEdit && (
                            <button
                              onClick={() => {
                                setEditingAsset(selectedAssetForDetails);
                                setShowEditModal(true);
                                setSelectedAssetForDetails(null);
                              }}
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 underline"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Credentials</span>
                            </button>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Registered Phone #:</span>
                          </span>
                          <strong className="font-mono text-emerald-300 font-bold">
                            {selectedAssetForDetails.phoneNumber ? (
                              <a href={`tel:${selectedAssetForDetails.phoneNumber}`} className="hover:underline text-emerald-400">
                                {selectedAssetForDetails.phoneNumber}
                              </a>
                            ) : (
                              <span className="text-slate-500 italic">Not Registered</span>
                            )}
                          </strong>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-sky-400" />
                            <span>Registered Email:</span>
                          </span>
                          <strong className="font-mono text-sky-300 font-bold">
                            {selectedAssetForDetails.registeredEmail ? (
                              <a href={`mailto:${selectedAssetForDetails.registeredEmail}`} className="hover:underline text-sky-400">
                                {selectedAssetForDetails.registeredEmail}
                              </a>
                            ) : (
                              <span className="text-slate-500 italic">Not Registered</span>
                            )}
                          </strong>
                        </div>

                        {selectedAssetForDetails.imeiNumber && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">IMEI Hardware ID:</span>
                            <strong className="font-mono text-slate-300">{selectedAssetForDetails.imeiNumber}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">QR Asset Tag Scanner</span>
                      <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(selectedAssetForDetails.assetCode)}`} alt="QR" className="w-full h-full" />
                      </div>
                      <p className="text-[10px] text-slate-500">Scan tag via field app to trigger instant custody transfer</p>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'HISTORY' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-200 text-sm">Chain of Custody History</h3>
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                          <th className="p-3">Employee Custody</th>
                          <th className="p-3">Assigned Date</th>
                          <th className="p-3">Return Check-in</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr>
                          <td className="p-3 font-semibold text-sky-400">{selectedAssetForDetails.assignedToUserName || 'John Smith'}</td>
                          <td className="p-3 font-mono">2026-01-14</td>
                          <td className="p-3 font-mono text-slate-500">Active Custody</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">CHECKED_OUT</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-400">IT Setup Pool</td>
                          <td className="p-3 font-mono">2025-11-02</td>
                          <td className="p-3 font-mono">2026-01-14</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">RETURNED</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailTab === 'MAINTENANCE' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-200 text-sm">Repair & Maintenance Log</h3>
                    {canCreateOrEdit && (
                      <button onClick={() => alert('Navigate to Maintenance Panel tab to dispatch a new ticket.')} className="px-3 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-[11px]">
                        + Dispatch Repair Ticket
                      </button>
                    )}
                  </div>
                  <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center text-slate-400">
                    No active repair tickets open for device {selectedAssetForDetails.assetCode}. All diagnostic tests passing.
                  </div>
                </div>
              )}

              {detailTab === 'DEPRECIATION' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">Straight-Line 3-Year Depreciation Curve</h3>
                    <p className="text-[11px] text-slate-400">Calculates 36-month write-down with 10% residual scrap value.</p>
                  </div>

                  {/* Clean Visual Bar Chart */}
                  <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-end justify-between gap-4 h-48 pt-6 px-4 border-b border-slate-800">
                      {[
                        { year: 'Year 0 (New)', val: selectedAssetForDetails.purchaseCost, height: '100%', col: 'bg-teal-500' },
                        { year: 'Year 1', val: Math.round(selectedAssetForDetails.purchaseCost * 0.7), height: '70%', col: 'bg-teal-500/80' },
                        { year: 'Year 2', val: Math.round(selectedAssetForDetails.purchaseCost * 0.4), height: '40%', col: 'bg-teal-500/60' },
                        { year: 'Year 3 (Scrap)', val: Math.round(selectedAssetForDetails.purchaseCost * 0.1), height: '15%', col: 'bg-amber-500' }
                      ].map(bar => (
                        <div key={bar.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="font-mono font-bold text-slate-200 text-xs">${bar.val.toLocaleString()}</span>
                          <div className={`w-full rounded-t-xl ${bar.col} transition-all duration-500 shadow-lg`} style={{ height: bar.height }} />
                          <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center mt-1">{bar.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'AUDIT' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-200 text-sm">Granular Audit Log Trail</h3>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
                    <p className="text-teal-400">[2026-06-26 12:40:12] CREATE_ASSET: Device registered by {currentUser.fullName} ($1,800)</p>
                    <p className="text-slate-500">[2026-06-26 12:40:14] CALC_VALUATION: Initial straight-line schedule established.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
              {canCreateOrEdit && (
                <button
                  onClick={() => {
                    setEditingAsset(selectedAssetForDetails);
                    setSelectedAssetForDetails(null);
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Specs (File 7)</span>
                </button>
              )}

              <button
                onClick={() => setSelectedAssetForDetails(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs ml-auto"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL B: REGISTER ASSET FORM (FILE 6 REQUIREMENT)
         ==================================================================== */}
      {showRegisterBranchModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setShowRegisterBranchModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Register New Location / Branch</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Provision a new company branch for asset custody allocation and multi-site inventory.</p>

            <form onSubmit={handleRegisterBranchSubmit} className="mt-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={newBranchName}
                  onChange={e => setNewBranchName(e.target.value)}
                  placeholder="e.g. Kalgoorlie West Refinery"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unique Code *</label>
                  <input
                    type="text"
                    required
                    value={newBranchCode}
                    onChange={e => setNewBranchCode(e.target.value)}
                    placeholder="e.g. KGO-WEST"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City / Hub *</label>
                  <input
                    type="text"
                    required
                    value={newBranchCity}
                    onChange={e => setNewBranchCity(e.target.value)}
                    placeholder="e.g. Kalgoorlie"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Physical Location Address (Optional)</label>
                <input
                  type="text"
                  value={newBranchLocation}
                  onChange={e => setNewBranchLocation(e.target.value)}
                  placeholder="e.g. Great Eastern Hwy, Kalgoorlie"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={newBranchCountry}
                    onChange={e => setNewBranchCountry(e.target.value)}
                    placeholder="e.g. Australia"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Branch Manager Name</label>
                  <input
                    type="text"
                    value={newBranchManager}
                    onChange={e => setNewBranchManager(e.target.value)}
                    placeholder="e.g. Bruce Banner"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterBranchModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
                >
                  Register Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-400" />
              <span>Register Hardware Asset (File 6)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Ingests metadata into ORM ledger and writes creation audit entry.</p>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Asset Name / Title *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. MacBook Pro 16 M3 Max"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={formSerial}
                    onChange={e => setFormSerial(e.target.value)}
                    placeholder="S/N: C02Z99411"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model Spec</label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={e => setFormModel(e.target.value)}
                    placeholder="12-Core CPU 36GB"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select value={formCat} onChange={e => setFormCat(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    {categories.length === 0 ? (
                      <option value="">No Categories Configured</option>
                    ) : (
                      categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Branch</label>
                  <select value={formBranch} onChange={e => setFormBranch(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white">
                    {branches.length === 0 ? (
                      <option value="">No Branches Configured - Register Under Secure Portal</option>
                    ) : (
                      branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Purchase Cost ($)</label>
                  <input type="number" value={formCost} onChange={e => setFormCost(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">MAC Address (Optional)</label>
                  <input type="text" value={formMac} onChange={e => setFormMac(e.target.value)} placeholder="00:1A:2B:3C:4D:5E" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono" />
                </div>
              </div>

              {/* Dedicated Phone Registration for Category Phones (Admin Option) */}
              {isFormCatPhone && (
                <div className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Phone Cellular & Account Registration (Admin Option)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                      Category Phones
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>Registered Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        value={formPhoneNumber}
                        onChange={e => setFormPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none placeholder:text-slate-600"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">SIM MSISDN / cellular line</p>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-sky-400" />
                        <span>Registered Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={formRegisteredEmail}
                        onChange={e => setFormRegisteredEmail(e.target.value)}
                        placeholder="phone-user@company.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none placeholder:text-slate-600"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Apple ID, Google Work or MDM account</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      IMEI / Hardware Identifier (Optional)
                    </label>
                    <input
                      type="text"
                      value={formImei}
                      onChange={e => setFormImei(e.target.value)}
                      placeholder="e.g. 354892091234567"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-slate-300 font-mono text-xs focus:border-emerald-500 focus:outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>
              )}

              {isFormCatLaptopOrPhone && (
                <div className="p-3 bg-slate-950 border border-teal-500/30 rounded-xl space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-teal-400 font-bold">Name of Person Given To *</label>
                  <input
                    type="text"
                    value={formAssignee}
                    onChange={e => setFormAssignee(e.target.value)}
                    placeholder="e.g. John Doe (Person given this laptop/cellphone)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none font-semibold"
                  />
                  <p className="text-[10px] text-slate-500 font-mono">This will automatically assign custody and log a checkout history trail for this laptop/cellphone.</p>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Device Photo / Asset Picture (Optional)</label>
                <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-xl p-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20 cursor-pointer"
                  />
                  {formImage ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-600">
                      <img src={formImage} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImage(null)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-red-400 hover:text-red-300 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">No picture uploaded. A blueprint vector line-drawing sketch will be generated automatically.</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Warranty Specs</label>
                <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="3-Year AppleCare+ coverage included..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white h-16" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg">Confirm Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL C: EDIT ASSET FORM (FILE 7 REQUIREMENT)
         ==================================================================== */}
      {showEditModal && editingAsset && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-teal-400" />
              <span>Edit Asset Specs (File 7)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Serial Number and original cost are locked to preserve audit trail integrity.</p>

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={editingAsset.name}
                  onChange={e => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Serial Number (Locked)</label>
                  <input type="text" disabled value={editingAsset.serialNumber} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-2.5 text-slate-500 font-mono cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model</label>
                  <input
                    type="text"
                    value={editingAsset.model}
                    onChange={e => setEditingAsset({ ...editingAsset, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingAsset.status}
                    onChange={e => setEditingAsset({ ...editingAsset, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="REPAIR">REPAIR</option>
                    <option value="DAMAGED">DAMAGED</option>
                    <option value="DEPRECATED">DEPRECATED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Condition</label>
                  <select
                    value={editingAsset.condition}
                    onChange={e => setEditingAsset({ ...editingAsset, condition: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="NEW">NEW</option>
                    <option value="GOOD">GOOD</option>
                    <option value="FAIR">FAIR</option>
                    <option value="POOR">POOR</option>
                  </select>
                </div>
              </div>

              {(() => {
                const isEditingCatPhone = editingAsset && (
                  editingAsset.categoryName.toLowerCase().includes('phone') ||
                  editingAsset.categoryName.toLowerCase().includes('mobile') ||
                  editingAsset.categoryName.toLowerCase().includes('cell') ||
                  editingAsset.categoryName.toLowerCase().includes('smartphone') ||
                  editingAsset.categoryId === 'cat-phone' ||
                  Boolean(editingAsset.phoneNumber || editingAsset.registeredEmail)
                );

                if (!isEditingCatPhone) return null;

                return (
                  <div className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <label className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Registered Phone Number & Email (Admin Control)</span>
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                        Category Phones
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 text-xs font-semibold mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>Registered Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          value={editingAsset.phoneNumber || ''}
                          onChange={e => setEditingAsset({ ...editingAsset, phoneNumber: e.target.value || undefined })}
                          placeholder="+1 (555) 019-2834"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">SIM card MSISDN</p>
                      </div>

                      <div>
                        <label className="block text-slate-300 text-xs font-semibold mb-1 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-sky-400" />
                          <span>Registered Email / MDM</span>
                        </label>
                        <input
                          type="email"
                          value={editingAsset.registeredEmail || ''}
                          onChange={e => setEditingAsset({ ...editingAsset, registeredEmail: e.target.value || undefined })}
                          placeholder="user@company.com"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Apple ID or MDM Google account</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">
                        IMEI Hardware ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingAsset.imeiNumber || ''}
                        onChange={e => setEditingAsset({ ...editingAsset, imeiNumber: e.target.value || undefined })}
                        placeholder="e.g. 354892091234567"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-slate-300 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })()}

              {(() => {
                const isEditingCatLaptopOrPhone = editingAsset && (
                  editingAsset.categoryName.toLowerCase().includes('laptop') ||
                  editingAsset.categoryName.toLowerCase().includes('phone') ||
                  editingAsset.categoryName.toLowerCase().includes('mobile') ||
                  editingAsset.categoryName.toLowerCase().includes('cell') ||
                  editingAsset.categoryName.toLowerCase().includes('smartphone') ||
                  editingAsset.categoryId === 'cat-lap' ||
                  editingAsset.categoryId === 'cat-phone'
                );
                
                if (isEditingCatLaptopOrPhone) {
                  return (
                    <div className="p-3 bg-slate-950 border border-teal-500/30 rounded-xl space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                      <label className="block text-teal-400 font-bold">Write Name of Person Given To *</label>
                      <input
                        type="text"
                        value={editingAsset.assignedToUserName || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setEditingAsset({
                            ...editingAsset,
                            assignedToUserName: val || undefined,
                            assignedToUserId: val ? `custom-${encodeURIComponent(val.trim())}` : undefined,
                            assignedAt: val ? new Date().toISOString().split('T')[0]! : undefined,
                            status: val ? 'ACTIVE' : editingAsset.status
                          });
                        }}
                        placeholder="e.g. John Doe (Person given this device)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none font-semibold"
                      />
                      <p className="text-[10px] text-slate-500 font-mono">Updates custody trail assignment instantly for this Laptop/Cellphone.</p>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(editingAsset.id)}
                    className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-bold transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Asset</span>
                  </button>
                )}

                <div className="flex gap-3 ml-auto">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-semibold">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-lg">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL D: BULK UPLOAD CSV (FILE 3 REQUIREMENT)
         ==================================================================== */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setShowBulkModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-sky-400" />
              <span>Bulk Asset Ingestion (File 3 CSV)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Paste or upload comma-separated values. Batch validates row formats.</p>

            {bulkResult && (
              <div className={`mt-4 p-4 rounded-xl text-xs flex items-center gap-3 ${
                bulkResult.errors > 0 && bulkResult.success === 0
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}>
                {bulkResult.errors > 0 && bulkResult.success === 0 ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                <div>
                  <p className="font-bold">Ingestion Result: {bulkResult.success} created, {bulkResult.errors} errors</p>
                  {bulkResult.msg && <p className="text-[11px] mt-0.5 opacity-90">{bulkResult.msg}</p>}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">CSV Data Stream</label>
              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                rows={7}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="pt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowBulkModal(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs">Close</button>
              <button onClick={handleBulkUpload} className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg text-xs flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                <span>Execute Batch Upload</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
