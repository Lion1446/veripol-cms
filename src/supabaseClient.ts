import { createClient } from '@supabase/supabase-js';
import { User as SupabaseUser } from '@supabase/auth-js';
import { User } from './models/User';

const supabaseUrl = 'https://jehxchqyswfjjicxzbyl.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaHhjaHF5c3dmamppY3h6YnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4NjE2MDMsImV4cCI6MjAzMjQzNzYwM30.rGuYkxg8vV_QSC9irqfX5TC3pcVcASr2dMOa5jge1hw';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const mapSupabaseUserToUser = (
  supabaseUser: SupabaseUser | null
): User | null => {
  if (!supabaseUser) return null;

  const user = User.fromJson({
    id: supabaseUser.id,
    email: supabaseUser.email!
  });

  return user;
};
