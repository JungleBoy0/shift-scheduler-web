// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://allifiamkmnuqltpsvlx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbGlmaWFta21udXFsdHBzdmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzE4NzQsImV4cCI6MjA0ODgwNzg3NH0.YvluaNgStzzr44HCIswejzNh9-yEPH_XurB5gByHXJo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);