
import React, { useState } from 'react';
import { UserProfile, UserAccount, UserRole } from '../types';

interface SettingsProps {
  user: UserProfile | null;
  accounts: UserAccount[];
  onAddAccount: (acc: UserAccount) => void;
  onDeleteAccount: (email: string) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  user, 
  accounts, 
  onAddAccount, 
  onDeleteAccount, 
  theme, 
  onThemeChange 
}) => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as UserRole
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;

    if (accounts.some(a => a.email === newUser.email)) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    onAddAccount({
      ...newUser,
      theme: 'light'
    });

    setNewUser({ name: '', email: '', password: '', role: 'user' });
    setIsAddUserModalOpen(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-2xl lg:text-3xl font-bold dark:text-white">Ajustes</h2>
        <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">Personalize seu ambiente e gerencie acessos.</p>
      </header>

      <div className="max-w-3xl space-y-6">
        {/* Appearance Section */}
        <section className="glass-card p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-4 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
              <i className="fas fa-palette text-sm lg:text-base"></i>
            </div>
            <h3 className="text-lg lg:text-xl font-bold dark:text-white">Aparência</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <button 
              onClick={() => onThemeChange('light')}
              className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all flex flex-col items-center gap-2 lg:gap-3 ${theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-amber-500">
                <i className="fas fa-sun text-lg lg:text-xl"></i>
              </div>
              <span className="text-xs lg:text-sm font-medium dark:text-white">Claro</span>
            </button>
            <button 
              onClick={() => onThemeChange('dark')}
              className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all flex flex-col items-center gap-2 lg:gap-3 ${theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-900 rounded-lg shadow-sm border border-gray-800 flex items-center justify-center text-blue-400">
                <i className="fas fa-moon text-lg lg:text-xl"></i>
              </div>
              <span className="text-xs lg:text-sm font-medium dark:text-white">Escuro</span>
            </button>
          </div>
        </section>

        {/* User Profile Section */}
        <section className="glass-card p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-4 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
              <i className="fas fa-user-circle text-sm lg:text-base"></i>
            </div>
            <h3 className="text-lg lg:text-xl font-bold dark:text-white">Seu Perfil</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Nome</label>
              <input 
                type="text" 
                defaultValue={user?.name}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">E-mail</label>
                <input 
                  type="email" 
                  disabled
                  defaultValue={user?.email}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none text-gray-400 cursor-not-allowed text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Nível de Acesso</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm font-bold uppercase">
                  {user?.role}
                </div>
              </div>
            </div>
            <button className="w-full lg:w-auto mt-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all text-sm uppercase tracking-wide">
              Salvar Alterações
            </button>
          </div>
        </section>

        {/* User Management Section (ADMIN ONLY) */}
        {user?.role === 'admin' && (
          <section className="glass-card p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm dark:bg-gray-800 border-t-4 border-blue-600">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                  <i className="fas fa-users-cog text-sm lg:text-base"></i>
                </div>
                <h3 className="text-lg lg:text-xl font-bold dark:text-white">Gestão de Usuários</h3>
              </div>
              <button 
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md"
              >
                Novo Usuário
              </button>
            </div>
            
            <div className="space-y-3">
              {accounts.map(acc => (
                <div key={acc.email} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-gray-600 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <i className={`fas ${acc.role === 'admin' ? 'fa-user-shield' : 'fa-user'}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">{acc.name} {acc.email === user.email && '(Você)'}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{acc.role} • {acc.email}</p>
                    </div>
                  </div>
                  {acc.email !== user.email && (
                    <button 
                      onClick={() => onDeleteAccount(acc.email)}
                      className="text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Data Management */}
        <section className="glass-card p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-4 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600">
              <i className="fas fa-database text-sm lg:text-base"></i>
            </div>
            <h3 className="text-lg lg:text-xl font-bold dark:text-white">Segurança</h3>
          </div>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Seus dados estão protegidos. Use as opções abaixo para gerenciar seu histórico.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-medium text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <i className="fas fa-file-export"></i> Exportar Dados
            </button>
            <button className="flex-1 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-medium text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-2">
              <i className="fas fa-trash"></i> Resetar Tudo
            </button>
          </div>
        </section>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 lg:p-8 shadow-2xl scale-in">
            <h3 className="text-xl lg:text-2xl font-bold mb-6 dark:text-white">Cadastrar Novo Usuário</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Nome</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                  placeholder="Nome Completo"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">E-mail</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                  placeholder="usuario@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Senha</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                  placeholder="Defina uma senha"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Nível de Acesso</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                >
                  <option value="user">Usuário Comum</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="flex-1 px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 text-sm bg-blue-600 text-white font-bold rounded-xl shadow-lg">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
