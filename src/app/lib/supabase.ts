
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ybcnkemtzrzzmexafcik.supabase.co';

const supabaseKey =
  'sb_publishable_8vak3DQ0LdH8aKpPiHJUfg_dO1DRF7x';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);