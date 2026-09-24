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
  
  const filtradas = reservas.filter((reserva) => { 
    const usuario = usuarios.find((item) => item.id === reserva.usuarioId)?.nome ?? ''; 
    const espaco = espacos.find((item) => item.id === reserva.espacoId)?.nome ?? ''; 
    return (!data || reserva.data === data) && 
           (!status || reserva.status === status) && 
           (!espacoId || reserva.espacoId === Number(espacoId)) && 
           `${usuario} ${espaco}`.toLowerCase().includes(busca.toLowerCase()); 
  }).sort((a,b) => `${a.data}${a.horarioInicio}`.localeCompare(`${b.data}${b.horarioInicio}`)); 
  
  if (loading) return <p>Carregando reservas...</p>; 
  
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Reservas</h1>
          <p className="mt-1 text-slate-600">Acompanhe e gerencie as reservas de espaços.</p>
        </div>
        <Link href="/reservas/nova" className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">Solicitar reserva</Link>
      </div>
      {error && <p className="mt-4 text-rose-700">{error}</p>}
      
      <section className="mt-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
        <input aria-label="Buscar por usuario ou espaço" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar usuario ou espaço" className="rounded border p-2" />
        <input aria-label="Filtrar por data" type="date" value={data} onChange={(event) => setData(event.target.value)} className="rounded border p-2" />
        <select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded border p-2">
          <option value="">Todos os status</option>
          {['PENDENTE','CONFIRMADA','EM_ANDAMENTO','FINALIZADA','CANCELADA'].map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}
        </select>
        <select aria-label="Filtrar por espaço" value={espacoId} onChange={(event) => setEspacoId(event.target.value)} className="rounded border p-2">
          <option value="">Todos os espaços</option>
          {espacos.map((espaco) => <option key={espaco.id} value={espaco.id}>{espaco.nome}</option>)}
        </select>
      </section>
      
      <div className="mt-5 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {['ID','Usuário','Espaço','Descrição','Data','Período','Status','Ações'].map((titulo) => <th key={titulo} className="p-3">{titulo}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtradas.map((reserva) => { 
              const espaco = espacos.find((item) => item.id === reserva.espacoId); 
              return (
                <tr key={reserva.id} className={reserva.status === 'CANCELADA' ? 'bg-rose-50/50' : 'border-t'}>
                  <td className="p-3">#{reserva.id}</td>
                  <td className="p-3">{usuarios.find((item) => item.id === reserva.usuarioId)?.nome}</td>
                  <td className="p-3">{espaco?.nome}</td>
                  <td className="p-3">{espaco?.descricao}</td>
                  <td className="p-3">{reserva.data}</td>
                  <td className="p-3">{reserva.horarioInicio} às {reserva.horarioFim}</td>
                  <td className="p-3"><ReservaStatusBadge status={reserva.status} /></td>
                  <td className="p-3 flex gap-2 items-center">
                    {(reserva.status === 'PENDENTE' || reserva.status === 'CONFIRMADA') && (
                      <button onClick={() => alterarStatus(reserva.id, 'EM_ANDAMENTO')} className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200">
                        Check-in
                      </button>
                    )}
                    {reserva.status === 'EM_ANDAMENTO' && (
                      <button onClick={() => alterarStatus(reserva.id, 'FINALIZADA')} className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded hover:bg-emerald-200">
                        Check-out
                      </button>
                    )}
                    <Link href={`/reservas/${reserva.id}`} className="font-semibold text-teal-700 ml-2">Ver detalhes</Link>
                  </td>
                </tr>
              ); 
            })}
          </tbody>
        </table>
        {!filtradas.length && <p className="p-6">Nenhuma reserva encontrada.</p>}
      </div>
    </>
  ); 
}
