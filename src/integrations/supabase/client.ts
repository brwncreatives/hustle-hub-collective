import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpbqzuazbmgyifhwphga.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYnF6dWF6Ym1neWlmaHdwaGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM4NTc2MDAsImV4cCI6MjAxOTQzMzYwMH0.vxJ7-RFxjLLvBx_M6dYmYQZZ0yHVXWvHj3FBqHE0WUE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);