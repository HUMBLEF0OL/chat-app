import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
    if (!supabaseClient) {
        supabaseClient = createClient(
            config.supabaseUrl,
            config.supabaseServiceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
    }
    return supabaseClient;
}
