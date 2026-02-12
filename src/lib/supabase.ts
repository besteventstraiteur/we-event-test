
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/types/supabase-db';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (e) {
    console.error('Error getting session:', e);
    return { session: null, error: e };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return { profile: null, error };
    }
    
    return { profile: data as Profile, error: null };
  } catch (e) {
    console.error('Error getting user profile:', e);
    return { profile: null, error: e };
  }
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export { supabase };
export type { Database };
