
import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionsProps {
  type: TransactionType;
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddCategory: (c: Category) => void;
  defaultDate?: string;
}

export const Transactions: React.FC<TransactionsProps> = ({ 
  type, 
  transactions, 
  categories, 
  onAddTransaction, 
  onDeleteTransaction, 
  onAddCategory,
  defaultDate 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    description: '', 
    amount: '', 
    date: defaultDate || new Date().toISOString().split('T')[0], 
    categoryId: '' 
  });
  const [catData, setCatData] = useState({ name: '', icon: 'fa-tag', color: 'text-blue-500' });

  // Sincronizar data se o período mudar no App
  useEffect(() => {
    if (defaultDate) {
      setFormData(prev => ({ ...prev, date: defaultDate }));
    }
  }, [defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.categoryId) return;
    
    onAddTransaction({
      id: Math.random().toString(36).substr(2, 9),
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      categoryId: formData.categoryId,
      type
    });
    
    setFormData({ 
      description: '', 
      amount: '', 
      date: defaultDate || new Date().toISOString().split('T')[0], 
      categoryId: '' 
    });
    setIsModalOpen(false);
  };

  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catData.name) return;
    
    onAddCategory({
      id: Math.random().toString(36).substr(2, 9),
      name: catData.name,
      icon: catData.icon,
      color: catData.color,
      type
    });
    
    setCatData({ name: '', icon: 'fa-tag', color: 'text-blue-500' });
    setIsCatModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold dark:text-white">
            {type === 'INCOME' ? 'Receitas' : 'Despesas'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie seu histórico financeiro.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <button 
            onClick={() => setIsCatModalOpen(true)}
            className="flex-1 md:flex-none px-3 lg:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-xs lg:text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <i className="fas fa-plus-circle"></i> Categoria
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex-1 md:flex-none px-4 lg:px-6 py-2 ${type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'} text-white rounded-xl font-bold text-xs lg:text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-current/20`}
          >
            <i className="fas fa-plus"></i> Novo Lançamento
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
        <div className="glass-card p-4 lg:p-6 rounded-2xl lg:rounded-3xl dark:bg-gray-800">
          <p className="text-[10px] lg:text-sm text-gray-500 mb-1 uppercase tracking-wider">Total</p>
          <h4 className={`text-sm lg:text-2xl font-bold ${type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(transactions.reduce((acc, curr) => acc + curr.amount, 0))}
          </h4>
        </div>
        <div className="glass-card p-4 lg:p-6 rounded-2xl lg:rounded-3xl dark:bg-gray-800">
          <p className="text-[10px] lg:text-sm text-gray-500 mb-1 uppercase tracking-wider">Registros</p>
          <h4 className="text-sm lg:text-2xl font-bold dark:text-white">{transactions.length}</h4>
        </div>
        <div className="hidden lg:block glass-card p-4 lg:p-6 rounded-2xl lg:rounded-3xl dark:bg-gray-800">
          <p className="text-[10px] lg:text-sm text-gray-500 mb-1 uppercase tracking-wider">Média</p>
          <h4 className="text-sm lg:text-2xl font-bold dark:text-white">{formatCurrency(transactions.length > 0 ? transactions.reduce((acc, curr) => acc + curr.amount, 0) / 1 : 0)}</h4>
        </div>
      </div>

      {/* List Table */}
      <div className="glass-card rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] lg:text-xs uppercase tracking-wider">
                <th className="px-4 lg:px-6 py-4">Data</th>
                <th className="px-4 lg:px-6 py-4">Descrição</th>
                <th className="px-4 lg:px-6 py-4">Categoria</th>
                <th className="px-4 lg:px-6 py-4 text-right">Valor</th>
                <th className="px-4 lg:px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {transactions.map((t) => {
                const cat = categories.find(c => c.id === t.categoryId);
                return (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 lg:px-6 py-3 text-xs lg:text-sm text-gray-500 dark:text-gray-400">{formatDate(t.date)}</td>
                    <td className="px-4 lg:px-6 py-3 font-medium text-xs lg:text-sm dark:text-white">{t.description}</td>
                    <td className="px-4 lg:px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center ${cat?.color.replace('text', 'bg').replace('-500', '-100')} ${cat?.color} dark:bg-opacity-20`}>
                          <i className={`fas ${cat?.icon} text-[10px] lg:text-xs`}></i>
                        </div>
                        <span className="text-xs lg:text-sm font-medium dark:text-gray-300">{cat?.name}</span>
                      </div>
                    </td>
                    <td className={`px-4 lg:px-6 py-3 text-right font-bold text-xs lg:text-sm ${type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-center">
                      <button 
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <i className="fas fa-trash-alt text-xs lg:text-sm"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 text-sm">Nenhum lançamento neste período.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-t-[2rem] sm:rounded-3xl w-full max-w-md p-6 lg:p-8 shadow-2xl scale-in pb-20 sm:pb-8">
            <h3 className="text-xl lg:text-2xl font-bold mb-6 dark:text-white">Novo Lançamento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Descrição</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                  placeholder="Ex: Pagamento..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Valor</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Data</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Categoria</label>
                <select 
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                >
                  <option value="">Selecione...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancelar</button>
                <button type="submit" className={`flex-1 px-4 py-3 text-sm ${type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'} text-white font-bold rounded-xl transition-all shadow-lg`}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-t-[2rem] sm:rounded-3xl w-full max-w-md p-6 lg:p-8 shadow-2xl scale-in pb-20 sm:pb-8">
            <h3 className="text-xl lg:text-2xl font-bold mb-6 dark:text-white">Nova Categoria</h3>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Nome</label>
                <input 
                  type="text" 
                  value={catData.name}
                  onChange={e => setCatData({...catData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                  placeholder="Nome da categoria"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 text-sm bg-blue-600 text-white font-bold rounded-xl shadow-lg">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
