
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, AreaChart, Area } from 'recharts';
import { analyzeData } from '../services/geminiService';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

const DataViz: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');

  const handleAnalyze = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      const results = await analyzeData(input);
      setData(results);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze data. Try providing more structured context.");
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (data.length === 0) return null;

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
            {data[0]?.secondaryValue && <Line type="monotone" dataKey="secondaryValue" stroke="#a855f7" strokeWidth={3} />}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="py-4 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Insight Engine</h2>
        <p className="text-slate-400">Describe your data or paste text, and Aether will visualize the trends.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass p-6 rounded-3xl flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Input Data</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: The global market for AI was $136B in 2022, expected to grow to $196B in 2023, $298B in 2024, and $450B by 2025..."
              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none resize-none mb-4 transition-all"
            />
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magnifying-glass-chart"></i>}
              Analyze & Chart
            </button>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Chart Style</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['bar', 'line', 'area'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    chartType === type ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-3xl p-8 relative flex flex-col overflow-hidden">
          {data.length > 0 ? (
            <div className="flex-1 w-full min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()!}
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600">
              <i className="fas fa-chart-line text-6xl mb-4"></i>
              <p className="text-xl">Awaiting analysis...</p>
              <p className="max-w-xs text-sm mt-2">Enter data in the input field to generate interactive visualizations.</p>
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-emerald-400 font-medium">Extracting Insights...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataViz;
