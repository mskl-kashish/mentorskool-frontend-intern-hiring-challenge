import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://igzrbinsumbnflivbwwe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnenJiaW5zdW1ibmZsaXZid3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MTQ5NDUsImV4cCI6MjA1NTM5MDk0NX0.EHKMuM4VDfe1Y9HTUeWigsYJhNAZjNVXCyw8bOm-chc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
