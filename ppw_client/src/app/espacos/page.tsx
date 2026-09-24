'use client';
import { useState } from 'react';
import { useReservas } from '@/components/reservas/reserva-provider';

export default function PaginaEspacos() {
  const { espacos, loading, error, adicionarEspaco } = useReservas();
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [valorPorHora, setValorPorHora] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 animate-pulse">Carregando espaços...</div>
      </div>
    );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await adicionarEspaco({ nome, descricao, capacidade: Number(capacidade), localizacao: 'N/A', valorPorHora: Number(valorPorHora) });
      setNome(''); setDescricao(''); setCapacidade(''); setValorPorHora('');
      setMostrarForm(false);
    } catch {
      alert('Erro ao criar espaço');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Espaços</h1>
          <p className="mt-1 text-sm text-slate-400">Catálogo de salas disponíveis para locação</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Cadastrar Espaço
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-rose-400 text-sm">{error}</div>
      )}

      {/* Formulário */}
      {mostrarForm && (
        <form onSubmit={onSubmit} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Novo Espaço</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nome</span>
              <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Sala A" className="mt-1.5 block w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Descrição</span>
              <input required type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Com projetor e ar-condicionado" className="mt-1.5 block w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Capacidade (pessoas)</span>
              <input required type="number" min="1" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} placeholder="Ex: 10" className="mt-1.5 block w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Valor por Hora (R$)</span>
              <input required type="number" min="0" step="0.01" value={valorPorHora} onChange={(e) => setValorPorHora(e.target.value)} placeholder="Ex: 50.00" className="mt-1.5 block w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={salvando} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50">
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </button>
            <button type="button" onClick={() => setMostrarForm(false)} className="rounded-xl border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Grid de espaços */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {espacos.map((espaco) => (
          <div key={espaco.id} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 space-y-3 hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-white">{espaco.nome}</p>
                <p className="text-sm text-slate-400 mt-0.5">{espaco.descricao}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700/50">
              <span className="flex items-center gap-1.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {espaco.capacidade} pessoas
              </span>
              <span className="font-semibold text-indigo-400">R$ {espaco.valorPorHora.toFixed(2)}/h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
