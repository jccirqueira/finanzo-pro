
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { EnergyControl } from './components/EnergyControl';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import { PeriodPicker } from './components/PeriodPicker';
import { Summary } from './components/Summary';
import { UserProfile, Transaction, Category, EnergyBill, UserAccount } from './types';
import { INITIAL_CATEGORIES, ADMIN_EMAIL, ADMIN_PASSWORD } from './constants';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [energyBills, setEnergyBills] = useState<EnergyBill[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(true);

  // Efeito inicial para carregar dados (Supabase prioritário, LocalStorage como fallback/cache)
  useEffect(() => {
    const initApp = async () => {
      // Tentar recuperar sessão do Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userData: UserProfile = {
            email: session.user.email!,
            name: profile.name,
            theme: profile.theme,
            role: profile.role
          };
          setUser(userData);
          setTheme(profile.theme);
          setIsAuthenticated(true);
          await loadUserData(session.user.id);
        }
      } else {
        // Fallback para LocalStorage para desenvolvimento offline
        const savedUser = localStorage.getItem('finanzo_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
        
        const savedTransactions = localStorage.getItem('finanzo_transactions');
        const savedBills = localStorage.getItem('finanzo_energy');
        const savedCategories = localStorage.getItem('finanzo_categories');
        const savedTheme = localStorage.getItem('finanzo_theme') as 'light' | 'dark';

        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        if (savedBills) setEnergyBills(JSON.parse(savedBills));
        if (savedCategories) setCategories(JSON.parse(savedCategories));
        if (savedTheme) setTheme(savedTheme);
      }
      
      // Carregar contas (apenas admin ou local)
      const savedAccounts = localStorage.getItem('finanzo_accounts');
      if (savedAccounts) {
        setAccounts(JSON.parse(savedAccounts));
      } else {
        const initialAdmin: UserAccount = {
          email: ADMIN_EMAIL,
          name: 'Administrador JCC',
          password: ADMIN_PASSWORD,
          role: 'admin',
          theme: 'light'
        };
        setAccounts([initialAdmin]);
        localStorage.setItem('finanzo_accounts', JSON.stringify([initialAdmin]));
      }
      
      setLoading(false);
    };

    initApp();
  }, []);

  const loadUserData = async (userId: string) => {
    const [transRes, billsRes, catsRes] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('energy_bills').select('*').eq('user_id', userId).order('month_year', { ascending: false }),
      supabase.from('categories').select('*').eq('user_id', userId)
    ]);

    if (transRes.data) setTransactions(transRes.data);
    if (billsRes.data) setEnergyBills(billsRes.data);
    if (catsRes.data && catsRes.data.length > 0) setCategories(catsRes.data);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('finanzo_theme', theme);
  }, [theme]);

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('finanzo_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setSelectedPeriod(null);
    localStorage.removeItem('finanzo_user');
  };

  const handleSelectPeriod = (period: string) => {
    setSelectedPeriod(period);
    setActiveTab('dashboard');
  };

  const addTransaction = async (t: Transaction) => {
    const newTransactions = [t, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem('finanzo_transactions', JSON.stringify(newTransactions));
    
    // Sync Supabase se logado
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('transactions').insert([{ ...t, user_id: user.id }]);
    }
  };

  const deleteTransaction = async (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    localStorage.setItem('finanzo_transactions', JSON.stringify(newTransactions));
    
    // Sync Supabase
    await supabase.from('transactions').delete().eq('id', id);
  };

  const addEnergyBill = async (b: EnergyBill) => {
    const newBills = [b, ...energyBills];
    setEnergyBills(newBills);
    localStorage.setItem('finanzo_energy', JSON.stringify(newBills));
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('energy_bills').insert([{ ...b, user_id: user.id }]);
    }
  };

  const deleteEnergyBill = async (id: string) => {
    const newBills = energyBills.filter(b => b.id !== id);
    setEnergyBills(newBills);
    localStorage.setItem('finanzo_energy', JSON.stringify(newBills));
    
    await supabase.from('energy_bills').delete().eq('id', id);
  };

  const addCategory = async (c: Category) => {
    const newCats = [...categories, c];
    setCategories(newCats);
    localStorage.setItem('finanzo_categories', JSON.stringify(newCats));
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('categories').insert([{ ...c, user_id: user.id }]);
    }
  };

  const handleAddAccount = (acc: UserAccount) => {
    const newAccounts = [...accounts, acc];
    setAccounts(newAccounts);
    localStorage.setItem('finanzo_accounts', JSON.stringify(newAccounts));
  };

  const handleDeleteAccount = (email: string) => {
    if (email === user?.email) {
      alert("Você não pode excluir a sua própria conta.");
      return;
    }
    const newAccounts = accounts.filter(a => a.email !== email);
    setAccounts(newAccounts);
    localStorage.setItem('finanzo_accounts', JSON.stringify(newAccounts));
  };

  const filteredTransactions = selectedPeriod 
    ? transactions.filter(t => t.date.startsWith(selectedPeriod))
    : transactions;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-400 animate-pulse">CARREGANDO FINANZO PRO...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} accounts={accounts} />;
  }

  if (!selectedPeriod && activeTab !== 'summary') {
    return (
      <PeriodPicker 
        onSelect={handleSelectPeriod} 
        onViewHistory={() => setActiveTab('summary')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        user={user}
        selectedPeriod={selectedPeriod}
        onChangePeriod={() => setSelectedPeriod(null)}
      />
      <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'summary' && (
            <Summary 
              transactions={transactions} 
              onSelectPeriod={handleSelectPeriod}
            />
          )}
          {activeTab === 'dashboard' && (
            <Dashboard 
              transactions={filteredTransactions} 
              energyBills={energyBills} 
              categories={categories}
            />
          )}
          {activeTab === 'income' && (
            <Transactions 
              type="INCOME" 
              transactions={filteredTransactions.filter(t => t.type === 'INCOME')} 
              categories={categories.filter(c => c.type === 'INCOME')}
              onAddTransaction={addTransaction}
              onDeleteTransaction={deleteTransaction}
              onAddCategory={addCategory}
              defaultDate={selectedPeriod ? `${selectedPeriod}-01` : undefined}
            />
          )}
          {activeTab === 'expenses' && (
            <Transactions 
              type="EXPENSE" 
              transactions={filteredTransactions.filter(t => t.type === 'EXPENSE')} 
              categories={categories.filter(c => c.type === 'EXPENSE')}
              onAddTransaction={addTransaction}
              onDeleteTransaction={deleteTransaction}
              onAddCategory={addCategory}
              defaultDate={selectedPeriod ? `${selectedPeriod}-01` : undefined}
            />
          )}
          {activeTab === 'energy' && (
            <EnergyControl 
              bills={energyBills} 
              onAddBill={addEnergyBill} 
              onDeleteBill={deleteEnergyBill}
            />
          )}
          {activeTab === 'settings' && (
            <Settings 
              user={user} 
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onDeleteAccount={handleDeleteAccount}
              theme={theme} 
              onThemeChange={setTheme} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
