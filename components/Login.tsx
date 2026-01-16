
import React, { useState } from 'react';
import { UserProfile, UserAccount } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  accounts: UserAccount[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, accounts }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const account = accounts.find(a => a.email === email && a.password === password);
      
      if (account) {
        onLogin({
          email: account.email,
          name: account.name,
          theme: account.theme,
          role: account.role
        });
      } else {
        setError('Credenciais inválidas.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 lg:w-96 h-64 lg:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 lg:w-96 h-64 lg:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col items-center mb-8 lg:mb-10">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30 mb-4 lg:mb-6 rotate-3">
              <i className="fas fa-wallet text-2xl lg:text-3xl"></i>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">Finanzo Pro</h1>
            <p className="text-sm lg:text-base text-gray-500 text-center px-4">Gestão inteligente para suas finanças.</p>
            <p className="text-[10px] lg:text-xs text-gray-400 text-center mt-1">By Cacir Soluções Tecnológicas | 2026</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div>
              <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">E-mail</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fas fa-envelope"></i>
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 lg:py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  placeholder="Seu e-mail"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs lg:text-sm font-semibold text-gray-700 uppercase tracking-wider">Senha</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 lg:py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  placeholder="Sua senha"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-xs font-medium text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 text-sm uppercase tracking-widest"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
