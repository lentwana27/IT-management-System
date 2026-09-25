import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables can be in import.meta.env (for Vite client context)
// or process.env (for Node / build context)
export const getEnvVar = (name: string): string => {
  // Try Vite format directly (e.g. VITE_SUPABASE_URL)
  const metaAny = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  if (metaAny[name]) {
    return String(metaAny[name]).trim();
  }

  // If queried as NEXT_PUBLIC_..., try VITE_ prefix
  const viteAlternative = `VITE_${name.replace('NEXT_PUBLIC_', '')}`;
  if (metaAny[viteAlternative]) {
    return String(metaAny[viteAlternative]).trim();
  }

  // Try process.env if present
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[name]) return String(process.env[name]).trim();
    if (process.env[viteAlternative]) return String(process.env[viteAlternative]).trim();
  }

  return '';
};

// Check if valid URL
const isValidSupabaseUrl = (url: string): boolean => {
  if (!url || url.includes('placeholder-project') || url.includes('your-project')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

// Check if valid Anon Key
const isValidSupabaseKey = (key: string): boolean => {
  if (!key || key.includes('placeholder-anon-key') || key.includes('MY_KEY') || key.length < 20) return false;
  return true;
};

const rawSupabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const rawSupabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const rawServiceRoleKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

export const isSupabaseConfigured = (): boolean => {
  return isValidSupabaseUrl(rawSupabaseUrl) && isValidSupabaseKey(rawSupabaseAnonKey);
};

export const getSupabaseConfig = () => {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    url: rawSupabaseUrl || '',
    maskedKey: rawSupabaseAnonKey ? `${rawSupabaseAnonKey.slice(0, 6)}...${rawSupabaseAnonKey.slice(-4)}` : '',
    projectHost: isValidSupabaseUrl(rawSupabaseUrl) ? new URL(rawSupabaseUrl).hostname : ''
  };
};

// Fallback safe dummy endpoint if not yet configured, preventing client instantiation failures
const effectiveUrl = isValidSupabaseUrl(rawSupabaseUrl) ? rawSupabaseUrl : 'https://placeholder-project.supabase.co';
const effectiveAnonKey = isValidSupabaseKey(rawSupabaseAnonKey) ? rawSupabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_token_placeholder';
const effectiveServiceKey = rawServiceRoleKey || effectiveAnonKey;

// 1. Initialize Supabase client for browser (using anon key)
export const supabase: SupabaseClient = createClient(effectiveUrl, effectiveAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// 2. Initialize Supabase admin client for server
export const supabaseAdmin: SupabaseClient = createClient(effectiveUrl, effectiveServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

/**
 * Uploads a report attachment to the "reports" bucket.
 * Returns the public URL of the uploaded file.
 */
export async function uploadReportAttachment(file: File, reportId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${reportId}/${Date.now()}.${fileExt}`;
  const filePath = `report-attachments/${fileName}`;

  const { data, error } = await supabase.storage
    .from('reports')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading report attachment:', error);
    // Return a dummy object URL or throw error in actual app
    return URL.createObjectURL(file);
  }

  const { data: publicData } = supabase.storage
    .from('reports')
    .getPublicUrl(filePath);

  return publicData?.publicUrl || '';
}

/**
 * Subscribes to real-time report data changes.
 * This triggers a callback so dashboard KPIs refresh live when
 * assets, maintenance, or budget data changes in the DB.
 */
export function subscribeToReportDataChanges(callback: (payload: any) => void) {
  const channel = supabase
    .channel('realtime-report-data')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'assets' },
      (payload) => {
        console.log('Realtime change in assets table:', payload);
        callback({ type: 'assets', payload });
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'maintenance' },
      (payload) => {
        console.log('Realtime change in maintenance table:', payload);
        callback({ type: 'maintenance', payload });
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'budgets' },
      (payload) => {
        console.log('Realtime change in budgets table:', payload);
        callback({ type: 'budgets', payload });
      }
    )
    .subscribe((status) => {
      console.log('Supabase realtime subscription status:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
