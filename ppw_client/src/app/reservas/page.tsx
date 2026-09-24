'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ReservaStatusBadge } from '@/components/reservas/reserva-status-badge';
import { useReservas } from '@/components/reservas/reserva-provider';

export default function PaginaReservas() {
  const { reservas, usuarios, espacos, loading, error, alterarStatus } = useReservas();
  const [busca, setBusca] = useState('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState('');
  const [espacoId, setEspacoId] = useState('');

  const filtradas = reservas
    .filter((reserva) => {
      const usuario = usuarios.find((u) => u.id === reserva.usuarioId)?.nome ?? '';
      const espaco = espacos.find((e) => e.id === reserva.espacoId)?.nome ?? '';
      return (
        (!data || reserva.data === data) &&
        (!status || reserva.status === status) &&
        (!espacoId || reserva.espacoId === Number(espacoId)) &&
        `${usuario} ${espaco}`.toLowerCase().includes(busca.toLowerCase())
      );
    })
    .sort((a, b) => `${a.data}${a.horarioInicio}`.localeCompare(`${b.data}${b.horarioInicio}`));

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 animate-pulse">Carregando reservas...</div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reservas</h1>
          <p className="mt-1 text-sm text-slate-400">Gerencie as locações de salas e espaços</p>
        </div>
        <Link
          href="/reservas/nova"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/30"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Reserva
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar usuário ou espaço..."
            className="w-full rounded-xl bg-slate-900/60 border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none"
        >
          <option value="">Todos os status</option>
          {['PENDENTE', 'CONFIRMADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'].map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={espacoId}
          onChange={(e) => setEspacoId(e.target.value)}
          className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none"
        >
          <option value="">Todos os espaços</option>
          {espacos.map((e) => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>
      </div>

      {/* Cards de reservas */}
      {filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-800/30 border border-slate-700/50 py-16 text-center">
          <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-500 font-medium">Nenhuma reserva encontrada</p>
          <p className="text-slate-600 text-sm mt-1">Tente ajustar os filtros ou crie uma nova reserva</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((reserva) => {
            const espaco = espacos.find((e) => e.id === reserva.espacoId);
            const usuario = usuarios.find((u) => u.id === reserva.usuarioId);
            const agora = new Date();
            const fimReserva = new Date(`${reserva.data}T${reserva.horarioFim}:00`);
            const atrasada = reserva.status === 'EM_ANDAMENTO' && agora > fimReserva;

            return (
              <div
                key={reserva.id}
                className={`rounded-2xl border p-5 flex flex-col gap-4 transition-all ${
                  atrasada
                    ? 'bg-rose-950/40 border-rose-500/30'
                    : reserva.status === 'CANCELADA'
                    ? 'bg-slate-800/30 border-slate-700/30 opacity-60'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {/* Topo do card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">#{reserva.id}</span>
                      <ReservaStatusBadge status={reserva.status} />
                      {atrasada && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-400">
                          ⚠ Urgente
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 font-semibold text-white truncate">{usuario?.nome ?? '—'}</p>
                    <p className="text-sm text-slate-400 truncate">{espaco?.nome ?? '—'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500">{reserva.data}</p>
                    <p className="text-sm font-semibold text-slate-300 mt-0.5">{reserva.horarioInicio} – {reserva.horarioFim}</p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                  {(reserva.status === 'PENDENTE' || reserva.status === 'CONFIRMADA') && (
                    <button
                      onClick={async () => {
                        try { await alterarStatus(reserva.id, 'EM_ANDAMENTO'); }
                        catch (e) { alert(e instanceof Error ? e.message : 'Erro ao fazer check-in'); }
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-600/30 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                      </svg>
                      Check-in
                    </button>
                  )}
                  {reserva.status === 'EM_ANDAMENTO' && (
                    <button
                      onClick={async () => {
                        try { await alterarStatus(reserva.id, 'FINALIZADA'); }
                        catch (e) { alert(e instanceof Error ? e.message : 'Erro ao fazer check-out'); }
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8" />
                      </svg>
                      Check-out
                    </button>
                  )}
                  <Link
                    href={`/reservas/${reserva.id}`}
                    className="ml-auto text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
