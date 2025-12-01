import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://wkogdbxgjlunvrhxtuvy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrb2dkYnhnamx1bnZyaHh0dXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODU2MzksImV4cCI6MjA3NjM2MTYzOX0.QHQRR7WfGqmISGYkOjbYAzIwvd_Ve9-a2i_7dhQ1zhI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
