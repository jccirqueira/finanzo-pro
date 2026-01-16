
import { createClient } from '@supabase/supabase-js';

// 1. ACESSE: Project Settings > API no Supabase
// 2. SUBSTITUA os valores abaixo pelas suas chaves reais
const supabaseUrl = 'https://hogpbqvdbbqyyzyckwzi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZ3BicXZkYmJxeXl6eWNrd3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MzU0MDgsImV4cCI6MjA4NDExMTQwOH0.-4b6vT6Zw6dBQmSYiy2_sC2NydJtOJMOzxFLdLl908E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* 
  =============================================================================
  PASSO A PASSO PARA CONFIGURAR O BANCO DE DATOS (SQL EDITOR)
  =============================================================================
  Copie o código abaixo, vá no seu painel do Supabase > SQL Editor > New Query,
  cole e clique em "RUN".
  -----------------------------------------------------------------------------

  -- 1. Tabela de Perfis (Vinculada ao Usuário do Supabase)
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    theme TEXT DEFAULT 'light',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 2. Tabela de Categorias
  CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    type TEXT CHECK (type IN ('INCOME', 'EXPENSE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 3. Tabela de Transações
  CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type TEXT CHECK (type IN ('INCOME', 'EXPENSE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 4. Tabela de Energia (CPFL x Serena)
  CREATE TABLE energy_bills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    month_year TEXT NOT NULL,
    kwh NUMERIC NOT NULL,
    cpfl_total NUMERIC NOT NULL,
    serena_total NUMERIC NOT NULL,
    discount_applied BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 5. Habilitar Segurança por Linha (RLS) - Garante que um usuário não veja dados do outro
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE energy_bills ENABLE ROW LEVEL SECURITY;

  -- 6. Políticas de Acesso (Exemplo para Transações: Usuário só lê/escreve o que é dele)
  CREATE POLICY "Users can manage their own transactions" ON transactions
    FOR ALL USING (auth.uid() = user_id);

  CREATE POLICY "Users can manage their own categories" ON categories
    FOR ALL USING (auth.uid() = user_id);

  CREATE POLICY "Users can manage their own energy bills" ON energy_bills
    FOR ALL USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can view and update their own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

  =============================================================================
*/
