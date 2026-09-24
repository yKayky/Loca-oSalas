'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReservas } from '@/components/reservas/reserva-provider';

export default function NovaReserva() {
  const router = useRouter();
  const { usuarios, espacos, criarReserva, loading } = useReservas();
  
  const [usuarioId, setUsuarioId] = useState('');
  const [espacoId, setEspacoId] = useState('');
  const [data, setData] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  
  const espaco = espacos.find((item) => item.id === Number(espacoId));
  
  async function enviar(event: FormEvent) {
    event.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      const reserva = await criarReserva({
        usuarioId: Number(usuarioId),
        espacoId: Number(espacoId),
        data,
        horarioInicio,
        horarioFim,
      });
      router.push(`/reservas/${reserva.id}`);
    } catch (erro) {
      setErro(erro instanceof Error ? erro.message : 'Não foi possível solicitar a reserva.');
    } finally {
      setSalvando(false);
    }
  }
  
  if (loading) return <p>Carregando dados...</p>;
  
  return (
    <>
      <h1 className="text-3xl font-bold">Nova reserva</h1>
      <p className="mt-2 text-slate-600">O novo agendamento será criado com o status PENDENTE.</p>
      <form onSubmit={enviar} className="mt-6 max-w-xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
        {erro && <p className="rounded bg-rose-50 p-3 text-rose-700">{erro}</p>}
        <label className="block font-medium">Usuário
          <select required value={usuarioId} onChange={(event) => setUsuarioId(event.target.value)} className="mt-1 block w-full rounded border p-2">
            <option value="">Selecione</option>
            {usuarios.map((usuario) => <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>)}
          </select>
        </label>
        <label className="block font-medium">Espaço
          <select required value={espacoId} onChange={(event) => setEspacoId(event.target.value)} className="mt-1 block w-full rounded border p-2">
            <option value="">Selecione</option>
            {espacos.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </select>
        </label>
        {espaco && (
          <div className="rounded-lg bg-teal-50 p-3 text-teal-900 space-y-1">
            <p><strong>Descrição:</strong> {espaco.descricao}</p>
            <p><strong>Capacidade:</strong> {espaco.capacidade} pessoas</p>
            <p><strong>Valor:</strong> R$ {espaco.valorPorHora.toFixed(2)}/hora</p>
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block font-medium">Data
            <input required type="date" value={data} onChange={(event) => setData(event.target.value)} className="mt-1 block w-full rounded border p-2" />
          </label>
          <label className="block font-medium">Início
            <input required type="time" value={horarioInicio} onChange={(event) => setHorarioInicio(event.target.value)} className="mt-1 block w-full rounded border p-2" />
          </label>
          <label className="block font-medium">Fim Previsto
            <input required type="time" value={horarioFim} onChange={(event) => setHorarioFim(event.target.value)} className="mt-1 block w-full rounded border p-2" />
          </label>
        </div>
        <button disabled={salvando} className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white disabled:opacity-50">
          {salvando ? 'Salvando...' : 'Solicitar reserva'}
        </button>
      </form>
    </>
  );
}
