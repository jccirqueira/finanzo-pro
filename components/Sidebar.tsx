
import React from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: UserProfile | null;
  selectedPeriod?: string | null;
  onChangePeriod?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  activeClass: string;
  darkActiveClass: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  user,
  selectedPeriod,
  onChangePeriod
}) => {
  const menuItems: MenuItem[] = [
    { 
      id: 'summary', 
      label: 'RESUMO GERAL', 
      icon: 'fa-list-check', 
      activeClass: 'bg-blue-50 text-blue-600', 
      darkActiveClass: 'dark:bg-blue-900/30 dark:text-blue-400' 
    },
    { 
      id: 'dashboard', 
      label: 'DASHBOARD', 
      icon: 'fa-table-columns', 
      activeClass: 'bg-purple-50 text-purple-600', 
      darkActiveClass: 'dark:bg-purple-900/30 dark:text-purple-400' 
    },
    { 
      id: 'income', 
      label: 'RECEITA', 
      icon: 'fa-hand-holding-dollar', 
      activeClass: 'bg-emerald-50 text-emerald-600', 
      darkActiveClass: 'dark:bg-emerald-900/30 dark:text-emerald-400' 
    },
    { 
      id: 'expenses', 
      label: 'DESPESAS', 
      icon: 'fa-file-invoice-dollar', 
      activeClass: 'bg-rose-50 text-rose-600', 
      darkActiveClass: 'dark:bg-rose-900/30 dark:text-rose-400' 
    },
    { 
      id: 'energy', 
      label: 'ENERGIA', 
      icon: 'fa-plug-circle-bolt', 
      activeClass: 'bg-amber-50 text-amber-500', 
      darkActiveClass: 'dark:bg-amber-900/30 dark:text-amber-400' 
    },
    { 
      id: 'settings', 
      label: 'AJUSTES', 
      icon: 'fa-sliders', 
      activeClass: 'bg-gray-100 text-gray-900', 
      darkActiveClass: 'dark:bg-gray-700 dark:text-white' 
    },
  ];

  const formatPeriod = (p: string) => {
    const [year, month] = p.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col sticky top-0 h-screen transition-all">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <i className="fas fa-wallet text-xl"></i>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Finanzo Pro
            </h1>
            <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">{user?.role} view</span>
          </div>
        </div>

        {selectedPeriod && (
          <div className="px-6 py-3 mx-4 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-between group">
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-400 font-bold uppercase">Período</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 capitalize">{formatPeriod(selectedPeriod)}</span>
            </div>
            <button 
              onClick={onChangePeriod}
              className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform shadow-sm"
              title="Mudar Período"
            >
              <i className="fas fa-calendar-alt"></i>
            </button>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 font-bold text-xs tracking-wider ${
                activeTab === item.id
                  ? `${item.activeClass} ${item.darkActiveClass}`
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-lg`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-blue-600">
              <i className="fas fa-user text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold text-xs"
          >
            <i className="fas fa-sign-out-alt w-6 text-center"></i>
            <span>SAIR</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-16 flex items-center justify-around px-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
              activeTab === item.id
                ? `${item.activeClass.split(' ')[1]} ${item.darkActiveClass.split(' ')[1]}`
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};
