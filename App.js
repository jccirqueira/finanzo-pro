
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login.js';
import { Dashboard } from './components/Dashboard.js';
import { Transactions } from './components/Transactions.js';
import { EnergyControl } from './components/EnergyControl.js';
import { Settings } from './components/Settings.js';
import { Sidebar } from './components/Sidebar.js';
import { PeriodPicker } from './components/PeriodPicker.js';
import { Summary } from './components/Summary.js';
import { INITIAL_CATEGORIES, ADMIN_EMAIL, ADMIN_PASSWORD } from './constants.js';
import { supabase } from './lib/supabase.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [energyBills, setEnergyBills] = useState([]);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              email: session.user.email,
              name: profile.name,
              theme: profile.theme,
              role: profile.role
            });
            setTheme(profile.theme);
            setIsAuthenticated(true);
            await loadUserData(session.user.id);
          }
        } else {
          const savedUser = localStorage.getItem('finanzo_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          }
        }
        
        const savedTransactions = localStorage.getItem('finanzo_transactions');
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        
        const savedAccounts = localStorage.getItem('finanzo_accounts');
        if (savedAccounts) {
          setAccounts(JSON.parse(savedAccounts));
        } else {
          setAccounts([{
            email: ADMIN_EMAIL,
            name: 'Administrador JCC',
            password: ADMIN_PASSWORD,
            role: 'admin',
            theme: 'light'
          }]);
        }
      } catch (err) {
        console.error("Erro na inicialização:", err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const loadUserData = async (userId) => {
    try {
      const [transRes, billsRes, catsRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('energy_bills').select('*').eq('user_id', userId).order('month_year', { ascending: false }),
        supabase.from('categories').select('*').eq('user_id', userId)
      ]);

      if (transRes.data) setTransactions(transRes.data);
      if (billsRes.data) setEnergyBills(billsRes.data);
      if (catsRes.data && catsRes.data.length > 0) setCategories(catsRes.data);
    } catch (e) {
      console.warn("Usando dados locais.");
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogin = (userData) => {
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

  if (loading) return null;

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} accounts={accounts} />;
  }

  if (!selectedPeriod && activeTab !== 'summary' && activeTab !== 'settings') {
    return (
      <PeriodPicker 
        onSelect={(p) => { setSelectedPeriod(p); setActiveTab('dashboard'); }} 
        onViewHistory={() => setActiveTab('summary')}
      />
    );
  }

  const filteredTransactions = selectedPeriod 
    ? transactions.filter(t => t.date.startsWith(selectedPeriod))
    : transactions;

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
          {activeTab === 'summary' && <Summary transactions={transactions} onSelectPeriod={(p) => { setSelectedPeriod(p); setActiveTab('dashboard'); }} />}
          {activeTab === 'dashboard' && <Dashboard transactions={filteredTransactions} energyBills={energyBills} categories={categories} />}
          {activeTab === 'income' && (
            <Transactions 
              type="INCOME" 
              transactions={filteredTransactions.filter(t => t.type === 'INCOME')} 
              categories={categories.filter(c => c.type === 'INCOME')}
              onAddTransaction={(t) => setTransactions([t, ...transactions])}
              onDeleteTransaction={(id) => setTransactions(transactions.filter(t => t.id !== id))}
              onAddCategory={(c) => setCategories([...categories, c])}
              defaultDate={selectedPeriod ? `${selectedPeriod}-01` : undefined}
            />
          )}
          {activeTab === 'expenses' && (
            <Transactions 
              type="EXPENSE" 
              transactions={filteredTransactions.filter(t => t.type === 'EXPENSE')} 
              categories={categories.filter(c => c.type === 'EXPENSE')}
              onAddTransaction={(t) => setTransactions([t, ...transactions])}
              onDeleteTransaction={(id) => setTransactions(transactions.filter(t => t.id !== id))}
              onAddCategory={(c) => setCategories([...categories, c])}
              defaultDate={selectedPeriod ? `${selectedPeriod}-01` : undefined}
            />
          )}
          {activeTab === 'energy' && (
            <EnergyControl 
              bills={energyBills} 
              onAddBill={(b) => setEnergyBills([b, ...energyBills])} 
              onDeleteBill={(id) => setEnergyBills(energyBills.filter(b => b.id !== id))}
            />
          )}
          {activeTab === 'settings' && (
            <Settings 
              user={user} 
              accounts={accounts}
              onAddAccount={(acc) => setAccounts([...accounts, acc])}
              onDeleteAccount={(email) => setAccounts(accounts.filter(a => a.email !== email))}
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
