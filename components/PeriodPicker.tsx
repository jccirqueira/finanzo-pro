
import React, { useState } from 'react';

interface PeriodPickerProps {
  onSelect: (period: string) => void;
  onViewHistory: () => void;
}

export const PeriodPicker: React.FC<PeriodPickerProps> = ({ onSelect, onViewHistory }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  
  const months = [
    { id: '01', name: 'Janeiro' }, { id: '02', name: 'Fevereiro' },
    { id: '03', name: 'Março' }, { id: '04', name: 'Abril' },
    { id: '05', name: 'Maio' }, { id: '06', name: 'Junho' },
    { id: '07', name: 'Julho' }, { id: '08', name: 'Agosto' },
    { id: '09', name: 'Setembro' }, { id: '10', name: 'Outubro' },
    { id: '11', name: 'Novembro' }, { id: '12', name: 'Dezembro' }
  ];

  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 animate-fadeIn">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold dark:text-white mb-2">Selecione o Período</h2>
          <p className="text-gray-500 dark:text-gray-400">Escolha o mês e ano para gerenciar seus lançamentos.</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] shadow-xl dark:bg-gray-800">
          <div className="flex justify-center gap-4 mb-8">
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y.toString())}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  selectedYear === y.toString() 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {months.map(m => (
              <button
                key={m.id}
                onClick={() => onSelect(`${selectedYear}-${m.id}`)}
                className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex flex-col items-center gap-1 group"
              >
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 uppercase">{selectedYear}</span>
                <span className="font-bold dark:text-white group-hover:text-blue-600">{m.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onViewHistory}
              className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-list-ul"></i> Ver Histórico Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
