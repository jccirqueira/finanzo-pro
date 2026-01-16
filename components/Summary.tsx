
import React from 'react';
import { Transaction } from '../types';

interface SummaryProps {
  transactions: Transaction[];
  onSelectPeriod: (period: string) => void;
}

export const Summary: React.FC<SummaryProps> = ({ transactions, onSelectPeriod }) => {
  // Agrupar transações por período (YYYY-MM)
  const totalsByPeriod = transactions.reduce((acc, t) => {
    const period = t.date.substring(0, 7); // YYYY-MM
    if (!acc[period]) {
      acc[period] = { income: 0, expense: 0, balance: 0 };
    }
    if (t.type === 'INCOME') acc[period].income += t.amount;
    else acc[period].expense += t.amount;
    acc[period].balance = acc[period].income - acc[period].expense;
    return acc;
  }, {} as Record<string, { income: number; expense: number; balance: number }>);

  const sortedPeriods = Object.keys(totalsByPeriod).sort().reverse();

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getMonthName = (monthStr: string) => {
    const date = new Date(2000, parseInt(monthStr) - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'long' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold dark:text-white">Histórico e Totalização</h2>
        <p className="text-gray-500 dark:text-gray-400">Resumo consolidado de todos os seus períodos financeiros.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPeriods.map(period => {
          const [year, month] = period.split('-');
          const { income, expense, balance } = totalsByPeriod[period];
          
          return (
            <div 
              key={period} 
              onClick={() => onSelectPeriod(period)}
              className="glass-card p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all cursor-pointer border-l-8 dark:bg-gray-800 group"
              style={{ borderLeftColor: balance >= 0 ? '#10b981' : '#ef4444' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold dark:text-white capitalize">{getMonthName(month)}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{year}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Receitas</span>
                  <span className="text-emerald-600 font-bold">{formatCurrency(income)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Despesas</span>
                  <span className="text-rose-600 font-bold">{formatCurrency(expense)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                  <span className="font-bold dark:text-gray-300">Saldo</span>
                  <span className={`font-black ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(balance)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {sortedPeriods.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card rounded-[2rem]">
            <i className="fas fa-history text-5xl text-gray-200 mb-4"></i>
            <p className="text-gray-400">Nenhum período com lançamentos registrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};
