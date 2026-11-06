import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qjngehohxqpicaypzusj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Browser & Client-side Supabase client
 * Uses the public publishable anon key.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
