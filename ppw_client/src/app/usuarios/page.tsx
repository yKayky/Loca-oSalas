'use client';
import { useState } from 'react';
import { useReservas } from '@/components/reservas/reserva-provider';

export default function PaginaUsuarios() {
  const { usuarios, loading, error, adicionarUsuario } = useReservas();
  const [nome, setNome] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 animate-pulse">Carregando usuários...</div>
      </div>
    );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      await adicionarUsuario(nome);
      setNome('');
      setMostrarForm(false);
    } catch {
      alert('Erro ao criar usuário');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuários</h1>
          <p className="mt-1 text-sm text-slate-400">Membros e locatários cadastrados no sistema</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Usuário
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-rose-400 text-sm">{error}</div>
      )}

      {/* Formulário inline */}
      {mostrarForm && (
        <form onSubmit={onSubmit} className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Novo Usuário</h2>
          <label className="block">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nome Completo</span>
            <input
              required
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              className="mt-1.5 block w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 max-w-sm"
            />
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={salvando} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50">
              {salvando ? 'Salvando...' : 'Adicionar'}
            </button>
            <button type="button" onClick={() => setMostrarForm(false)} className="rounded-xl border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista */}
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
        <div className="grid grid-cols-[48px_1fr] text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 border-b border-slate-700/50">
          <span>ID</span>
          <span>Nome</span>
        </div>
        {usuarios.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">Nenhum usuário cadastrado.</div>
        ) : (
          usuarios.map((usuario) => (
            <div key={usuario.id} className="grid grid-cols-[48px_1fr] items-center px-5 py-3.5 border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors">
              <span className="text-xs font-mono text-slate-500">#{usuario.id}</span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {usuario.nome.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-200">{usuario.nome}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
