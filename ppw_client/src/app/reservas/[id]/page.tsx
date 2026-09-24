'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ReservaStatusBadge } from '@/components/reservas/reserva-status-badge';
import { useReservas } from '@/components/reservas/reserva-provider';
import { StatusReserva } from '@/types/reserva';

const proximaAcao: Partial<Record<StatusReserva, { texto: string; status: StatusReserva }>> = { 
  PENDENTE: { texto: 'Fazer check-in', status: 'EM_ANDAMENTO' }, 
  CONFIRMADA: { texto: 'Fazer check-in', status: 'EM_ANDAMENTO' }, 
  EM_ANDAMENTO: { texto: 'Fazer check-out (Finalizar)', status: 'FINALIZADA' } 
};

export default function DetalheReserva() { 
  const { id } = useParams<{ id: string }>(); 
  const router = useRouter(); 
  const { reservas, usuarios, espacos, loading, alterarStatus, editarReserva } = useReservas(); 
  const [erro, setErro] = useState(''); 
  const [salvando, setSalvando] = useState(false); 
  const [editando, setEditando] = useState(false); 
  
  const reserva = reservas.find((item) => item.id === Number(id)); 
  
  if (loading) return <p>Carregando reservas...</p>; 
  if (!reserva) return <div><h1 className="text-3xl font-bold">Reserva não encontrada</h1><Link href="/reservas" className="mt-4 inline-block text-teal-700">Voltar para reservas</Link></div>; 
  
  const usuario = usuarios.find((item) => item.id === reserva.usuarioId); 
  const espaco = espacos.find((item) => item.id === reserva.espacoId); 
  const acao = proximaAcao[reserva.status]; 
  
  async function mudarStatus(status: StatusReserva) { 
    setErro(''); 
    setSalvando(true); 
    try { 
      await alterarStatus(reserva!.id, status); 
      router.refresh(); 
    } catch (erro) { 
      setErro(erro instanceof Error ? erro.message : 'Não foi possível atualizar a reserva.'); 
    } finally { 
      setSalvando(false); 
    } 
  } 
  
  async function editar(event: FormEvent<HTMLFormElement>) { 
    event.preventDefault(); 
    const dados = new FormData(event.currentTarget); 
    setSalvando(true); 
    try { 
      await editarReserva(reserva!.id, { 
        usuarioId: Number(dados.get('usuarioId')), 
        espacoId: Number(dados.get('espacoId')), 
        data: String(dados.get('data')), 
        horarioInicio: String(dados.get('horarioInicio')),
        horarioFim: String(dados.get('horarioFim')) 
      }); 
      setEditando(false); 
    } catch (erro) { 
      setErro(erro instanceof Error ? erro.message : 'Não foi possível editar a reserva.'); 
    } finally { 
      setSalvando(false); 
    } 
  } 
  
  async function cancelar() { 
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) await mudarStatus('CANCELADA'); 
  } 
  
  return (
    <>
      <Link href="/reservas" className="text-sm font-semibold text-teal-700">← Voltar para reservas</Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Reserva #{reserva.id}</h1>
        <ReservaStatusBadge status={reserva.status} />
      </div>
      {erro && <p className="mt-4 rounded bg-rose-50 p-3 text-rose-700">{erro}</p>}
      <section className="mt-6 max-w-2xl rounded-xl bg-white p-6 shadow-sm">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div><dt className="text-sm text-slate-500">Usuário</dt><dd className="font-semibold">{usuario?.nome ?? 'Usuário não encontrado'}</dd></div>
          <div><dt className="text-sm text-slate-500">Espaço</dt><dd className="font-semibold">{espaco?.nome ?? 'Espaço não encontrado'}</dd></div>
          <div><dt className="text-sm text-slate-500">Valor / hora</dt><dd>R$ {espaco?.valorPorHora.toFixed(2) ?? '?'}</dd></div>
          <div><dt className="text-sm text-slate-500">Data e horário</dt><dd>{reserva.data} · {reserva.horarioInicio} até {reserva.horarioFim}</dd></div>
          
          {reserva.checkInReal && <div><dt className="text-sm text-slate-500">Check-in Real</dt><dd>{new Date(reserva.checkInReal).toLocaleString('pt-BR')}</dd></div>}
          {reserva.checkOutReal && <div><dt className="text-sm text-slate-500">Check-out Real</dt><dd>{new Date(reserva.checkOutReal).toLocaleString('pt-BR')}</dd></div>}
          
          {reserva.tempoExcedenteMinutos !== undefined && reserva.tempoExcedenteMinutos > 0 && (
            <div className="col-span-full rounded bg-rose-50 p-4">
              <dt className="text-sm font-medium text-rose-800">Tempo Excedente</dt>
              <dd className="text-rose-900 font-bold">{reserva.tempoExcedenteMinutos} minutos (Valor Adicional: R$ {reserva.valorExcedente?.toFixed(2)})</dd>
            </div>
          )}

          <div><dt className="text-sm text-slate-500">Criada em</dt><dd>{new Date(reserva.createdAt).toLocaleString('pt-BR')}</dd></div>
          <div><dt className="text-sm text-slate-500">Atualizada em</dt><dd>{new Date(reserva.updatedAt).toLocaleString('pt-BR')}</dd></div>
        </dl>
        
        <div className="mt-7 flex flex-wrap gap-3">
          {acao && (
            <button disabled={salvando} onClick={() => mudarStatus(acao.status)} className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
              {salvando ? 'Salvando...' : acao.texto}
            </button>
          )}
          {(reserva.status === 'PENDENTE' || reserva.status === 'CONFIRMADA') && (
            <>
              <button disabled={salvando} onClick={() => setEditando(!editando)} className="rounded-lg border border-teal-300 px-4 py-2 font-semibold text-teal-700">Editar reserva</button>
              <button disabled={salvando} onClick={cancelar} className="rounded-lg border border-rose-300 px-4 py-2 font-semibold text-rose-700">{salvando ? 'Cancelando...' : 'Cancelar reserva'}</button>
            </>
          )}
          {!acao && reserva.status !== 'PENDENTE' && reserva.status !== 'CONFIRMADA' && (
            <p className="text-slate-500">Nenhuma ação de fluxo disponível.</p>
          )}
        </div>
        
        {editando && (
          <form onSubmit={editar} className="mt-6 grid gap-3 border-t pt-5 sm:grid-cols-2">
            <label>Usuário
              <select name="usuarioId" defaultValue={reserva.usuarioId} className="mt-1 w-full rounded border p-2">
                {usuarios.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
              </select>
            </label>
            <label>Espaço
              <select name="espacoId" defaultValue={reserva.espacoId} className="mt-1 w-full rounded border p-2">
                {espacos.map((item) => <option key={item.id} value={item.id}>{item.nome} — {item.descricao}</option>)}
              </select>
            </label>
            <label className="sm:col-span-2">Data
              <input name="data" type="date" defaultValue={reserva.data} className="mt-1 w-full rounded border p-2" />
            </label>
            <label>Horário Início
              <input name="horarioInicio" type="time" defaultValue={reserva.horarioInicio} className="mt-1 w-full rounded border p-2" />
            </label>
            <label>Horário Fim
              <input name="horarioFim" type="time" defaultValue={reserva.horarioFim} className="mt-1 w-full rounded border p-2" />
            </label>
            <button disabled={salvando} className="w-fit rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </form>
        )}
      </section>
    </>
  ); 
}
