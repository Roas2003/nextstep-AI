import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ybcnkentzrzzmexafcik.supabase.co";
const supabaseKey = "sb_publishable_8vak3DQ0LdH8aKp1HJUfg_d01DRF7x";

export const supabase = createClient(supabaseUrl, supabaseKey);