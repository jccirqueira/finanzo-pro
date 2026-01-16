
import React, { useState } from 'react';
import { EnergyBill } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EnergyControlProps {
  bills: EnergyBill[];
  onAddBill: (b: EnergyBill) => void;
  onDeleteBill: (id: string) => void;
}

export const EnergyControl: React.FC<EnergyControlProps> = ({ bills, onAddBill, onDeleteBill }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentYear = new Date().getFullYear().toString();
  const [formData, setFormData] = useState({ 
    month: '', 
    year: currentYear, 
    kwh: '', 
    cpflTotal: '', 
    serenaTotal: '' 
  });

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleDelete = (id: string, monthYear: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o lançamento de ${monthYear}?`)) {
      onDeleteBill(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kwh = parseFloat(formData.kwh) || 0;
    const cpflTotal = parseFloat(formData.cpflTotal);
    const serenaTotal = parseFloat(formData.serenaTotal);
    
    if (isNaN(cpflTotal) || isNaN(serenaTotal) || !formData.month) return;

    onAddBill({
      id: Math.random().toString(36).substr(2, 9),
      monthYear: `${formData.month}/${formData.year}`,
      kwh,
      cpflTotal,
      serenaTotal,
      discountApplied: true
    });

    setFormData({ 
      month: '', 
      year: currentYear, 
      kwh: '', 
      cpflTotal: '', 
      serenaTotal: '' 
    });
    setIsModalOpen(false);
  };

  const totalSaved = bills.reduce((acc, b) => acc + (b.cpflTotal - b.serenaTotal), 0);

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold dark:text-white">Controle de Energia</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Lance suas faturas CPFL e Serena para calcular sua economia.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30"
        >
          <i className="fas fa-file-invoice-dollar"></i> Lançar Faturas do Mês
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="glass-card p-5 lg:p-6 rounded-2xl lg:rounded-3xl dark:bg-gray-800 border-l-4 border-amber-500">
          <p className="text-[10px] lg:text-sm text-gray-500 mb-1 uppercase tracking-wider">Economia Total Acumulada</p>
          <h4 className="text-xl lg:text-3xl font-bold text-amber-500">{formatCurrency(totalSaved)}</h4>
        </div>
        <div className="glass-card p-5 lg:p-6 rounded-2xl lg:rounded-3xl dark:bg-gray-800 border-l-4 border-blue-500">
          <p className="text-[10px] lg:text-sm text-gray-500 mb-1 uppercase tracking-wider">Consumo Médio</p>
          <h4 className="text-xl lg:text-3xl font-bold dark:text-white">
            {bills.length > 0 ? (bills.reduce((a, b) => a + b.kwh, 0) / bills.length).toFixed(0) : 0} kWh
          </h4>
        </div>
        <div className="glass-card p-5 lg:p-6 rounded-2xl lg:rounded-3xl dark:bg-gray-800 border-l-4 border-emerald-500">
          <p className="text-[10px] lg:text-sm text-gray-500 mb-1 uppercase tracking-wider">Meses Monitorados</p>
          <h4 className="text-xl lg:text-3xl font-bold dark:text-white">{bills.length} Meses</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 glass-card p-4 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm dark:bg-gray-800">
          <h3 className="text-base lg:text-xl font-bold mb-6 dark:text-white">Comparativo de Custos Mensais</h3>
          <div className="h-60 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bills}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:stroke-gray-700" />
                <XAxis dataKey="monthYear" stroke="#9ca3af" axisLine={false} tickLine={false} fontSize={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                <Bar name="Fatura CPFL" dataKey="cpflTotal" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar name="Fatura Serena" dataKey="serenaTotal" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm dark:bg-gray-800">
          <h3 className="text-base lg:text-xl font-bold mb-6 dark:text-white">Impacto Ecológico</h3>
          <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl lg:rounded-2xl flex items-center justify-center text-green-600">
                <i className="fas fa-tree lg:text-xl"></i>
              </div>
              <div>
                <p className="text-[10px] lg:text-sm text-gray-500 uppercase tracking-wider">Árvores Preservadas</p>
                <p className="text-sm lg:text-lg font-bold dark:text-white">{(bills.reduce((a, b) => a + b.kwh, 0) * 0.04).toFixed(1)} equivalentes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl lg:rounded-2xl flex items-center justify-center text-blue-600">
                <i className="fas fa-cloud lg:text-xl"></i>
              </div>
              <div>
                <p className="text-[10px] lg:text-sm text-gray-500 uppercase tracking-wider">Emissões de CO2</p>
                <p className="text-sm lg:text-lg font-bold dark:text-white">{(bills.reduce((a, b) => a + b.kwh, 0) * 0.47).toFixed(1)} kg evitados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Faturas */}
      <div className="glass-card p-4 lg:p-6 rounded-3xl shadow-sm dark:bg-gray-800 overflow-hidden">
        <h3 className="text-base lg:text-lg font-bold mb-6 dark:text-white px-2">Histórico Detalhado de Economia</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                <th className="px-4 pb-4">Mês/Ano</th>
                <th className="px-4 pb-4 text-center">Consumo (kWh)</th>
                <th className="px-4 pb-4 text-right">Fatura CPFL</th>
                <th className="px-4 pb-4 text-right">Fatura Serena</th>
                <th className="px-4 pb-4 text-right text-amber-500">Desconto (Economia)</th>
                <th className="px-4 pb-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-4 font-bold dark:text-white text-sm">{b.monthYear}</td>
                  <td className="px-4 py-4 text-center dark:text-gray-300 text-sm">{b.kwh}</td>
                  <td className="px-4 py-4 text-right text-gray-500 dark:text-gray-400 text-sm">{formatCurrency(b.cpflTotal)}</td>
                  <td className="px-4 py-4 text-right text-gray-500 dark:text-gray-400 text-sm">{formatCurrency(b.serenaTotal)}</td>
                  <td className="px-4 py-4 text-right font-black text-amber-500 text-sm">
                    {formatCurrency(b.cpflTotal - b.serenaTotal)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(b.id, b.monthYear)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      title="Excluir lançamento"
                    >
                      <i className="fas fa-trash-alt text-xs lg:text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Nenhuma fatura lançada ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Improved Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-t-[2rem] sm:rounded-3xl w-full max-w-md p-6 lg:p-8 shadow-2xl scale-in pb-20 sm:pb-8">
            <h3 className="text-xl lg:text-2xl font-bold mb-2 dark:text-white text-center">Lançar Faturas</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">Informe os valores totais das contas recebidas.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Mês</label>
                  <select 
                    value={formData.month}
                    onChange={e => setFormData({...formData, month: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-amber-500 dark:text-white text-sm"
                    required
                  >
                    <option value="">...</option>
                    <option value="Jan">Janeiro</option>
                    <option value="Fev">Fevereiro</option>
                    <option value="Mar">Março</option>
                    <option value="Abr">Abril</option>
                    <option value="Mai">Maio</option>
                    <option value="Jun">Junho</option>
                    <option value="Jul">Julho</option>
                    <option value="Ago">Agosto</option>
                    <option value="Set">Setembro</option>
                    <option value="Out">Outubro</option>
                    <option value="Nov">Novembro</option>
                    <option value="Dez">Dezembro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Ano</label>
                  <input 
                    type="number" 
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-amber-500 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wide">Consumo Total (kWh)</label>
                <input 
                  type="number" 
                  value={formData.kwh}
                  onChange={e => setFormData({...formData, kwh: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-amber-500 dark:text-white text-sm"
                  placeholder="Ex: 450"
                />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Valor Total CPFL (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.cpflTotal}
                    onChange={e => setFormData({...formData, cpflTotal: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-none focus:ring-2 focus:ring-amber-500 dark:text-white text-sm shadow-sm"
                    placeholder="0,00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-500 mb-1 uppercase tracking-wide">Valor Total Serena (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.serenaTotal}
                    onChange={e => setFormData({...formData, serenaTotal: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-none focus:ring-2 focus:ring-amber-500 dark:text-white text-sm shadow-sm"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 text-sm bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20">Salvar Faturas</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
