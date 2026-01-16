
import React from 'react';
import { Transaction, EnergyBill, Category } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  energyBills: EnergyBill[];
  categories: Category[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, energyBills, categories }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const totalEnergySavings = energyBills.reduce((acc, curr) => acc + (curr.cpflTotal - curr.serenaTotal), 0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const dayIncome = transactions
      .filter(t => t.type === 'INCOME' && t.date === date)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const dayExpense = transactions
      .filter(t => t.type === 'EXPENSE' && t.date === date)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    return {
      date: date.split('-').slice(2).join('/'),
      income: dayIncome,
      expense: dayExpense
    };
  });

  const expenseByCategory = categories
    .filter(c => c.type === 'EXPENSE')
    .map(c => {
      const total = transactions
        .filter(t => t.categoryId === c.id)
        .reduce((acc, curr) => acc + curr.amount, 0);
      return { name: c.name, value: total, color: c.color.replace('text-', '') };
    })
    .filter(c => c.value > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-2xl lg:text-3xl font-bold dark:text-white">Dashboard</h2>
        <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">Resumo da sua saúde financeira hoje.</p>
      </header>

      {/* Stats Grid - 2 columns on mobile, 4 on large screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <StatCard 
          label="Saldo Geral" 
          value={formatCurrency(balance)} 
          icon="fa-wallet" 
          color="bg-blue-600" 
          trend={balance >= 0 ? 'up' : 'down'}
        />
        <StatCard 
          label="Receitas" 
          value={formatCurrency(totalIncome)} 
          icon="fa-arrow-up" 
          color="bg-emerald-600" 
          trend="up"
        />
        <StatCard 
          label="Despesas" 
          value={formatCurrency(totalExpense)} 
          icon="fa-arrow-down" 
          color="bg-rose-600" 
          trend="down"
        />
        <StatCard 
          label="Econ. Serena" 
          value={formatCurrency(totalEnergySavings)} 
          icon="fa-bolt" 
          color="bg-amber-500" 
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-4 lg:p-6 rounded-3xl shadow-sm dark:bg-gray-800">
          <h3 className="text-base lg:text-lg font-bold mb-4 lg:mb-6 dark:text-white">Fluxo de Caixa (7 dias)</h3>
          <div className="h-60 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="date" stroke="#9ca3af" axisLine={false} tickLine={false} fontSize={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="glass-card p-4 lg:p-6 rounded-3xl shadow-sm dark:bg-gray-800">
          <h3 className="text-base lg:text-lg font-bold mb-4 lg:mb-6 dark:text-white">Gastos / Categoria</h3>
          <div className="h-48 lg:h-64">
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <i className="fas fa-chart-pie text-3xl mb-2"></i>
                <p className="text-sm">Sem dados</p>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {expenseByCategory.slice(0, 4).map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="dark:text-gray-300 truncate max-w-[80px]">{cat.name}</span>
                </div>
                <span className="font-bold dark:text-white">{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="glass-card p-4 lg:p-6 rounded-3xl shadow-sm dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base lg:text-lg font-bold dark:text-white">Transações Recentes</h3>
          <button className="text-blue-600 hover:underline text-xs font-medium uppercase tracking-wider">Ver tudo</button>
        </div>
        <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                <th className="pb-4">Descrição</th>
                <th className="pb-4">Categoria</th>
                <th className="pb-4">Data</th>
                <th className="pb-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {transactions.slice(0, 5).map((t) => {
                const cat = categories.find(c => c.id === t.categoryId);
                return (
                  <tr key={t.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 lg:py-4 font-medium dark:text-white text-sm truncate max-w-[150px]">{t.description}</td>
                    <td className="py-3 lg:py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cat?.color.replace('text', 'bg').replace('-500', '-100')} ${cat?.color} dark:bg-opacity-20`}>
                        {cat?.name}
                      </span>
                    </td>
                    <td className="py-3 lg:py-4 text-gray-500 dark:text-gray-400 text-[11px]">{formatDate(t.date)}</td>
                    <td className={`py-3 lg:py-4 text-right font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount).replace('R$', '')}
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">Nenhuma transação.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, icon: string, color: string, trend?: 'up' | 'down' }> = ({ label, value, icon, color, trend }) => (
  <div className="glass-card p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm dark:bg-gray-800 relative overflow-hidden group">
    <div className={`absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
      <i className={`fas ${icon} text-4xl lg:text-6xl`}></i>
    </div>
    <div className={`${color} w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-2xl flex items-center justify-center text-white mb-2 lg:mb-4 shadow-lg shadow-current/20`}>
      <i className={`fas ${icon} text-sm lg:text-lg`}></i>
    </div>
    <p className="text-gray-500 dark:text-gray-400 text-[10px] lg:text-sm font-medium truncate">{label}</p>
    <div className="flex flex-col lg:flex-row lg:items-baseline gap-0 lg:gap-2 mt-0.5">
      <h4 className="text-sm lg:text-2xl font-bold dark:text-white truncate">{value}</h4>
    </div>
  </div>
);
