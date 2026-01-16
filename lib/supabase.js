
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hogpbqvdbbqyyzyckwzi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZ3BicXZkYmJxeXl6eWNrd3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MzU0MDgsImV4cCI6MjA4NDExMTQwOH0.-4b6vT6Zw6dBQmSYiy2_sC2NydJtOJMOzxFLdLl908E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
