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

  if (loading) return <p>Carregando espaços...</p>; 
  
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await adicionarEspaco({
        nome,
        descricao,
        capacidade: Number(capacidade),
        localizacao: 'N/A', // simplificado
        valorPorHora: Number(valorPorHora)
      });
      setNome('');
      setDescricao('');
      setCapacidade('');
      setValorPorHora('');
    } catch (err) {
      alert('Erro ao criar espaço');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Espaços</h1>
      <p className="mt-2 text-slate-600">Catálogo de espaços disponíveis para locação.</p>
      {error && <p className="mt-4 text-rose-700">{error}</p>}
      
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-5 max-w-4xl bg-white p-4 rounded-xl shadow-sm items-end">
        <label className="block font-medium">Nome
          <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Sala A" className="mt-1 block w-full rounded border p-2" />
        </label>
        <label className="block font-medium md:col-span-2">Descrição
          <input required type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Sala com projetor" className="mt-1 block w-full rounded border p-2" />
        </label>
        <label className="block font-medium">Capacidade
          <input required type="number" min="1" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} placeholder="Pessoas" className="mt-1 block w-full rounded border p-2" />
        </label>
        <label className="block font-medium">Valor / Hr
          <input required type="number" min="0" step="0.01" value={valorPorHora} onChange={(e) => setValorPorHora(e.target.value)} placeholder="R$" className="mt-1 block w-full rounded border p-2" />
        </label>
        <div className="md:col-span-5 flex justify-end">
          <button disabled={salvando} className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
            {salvando ? 'Salvando...' : 'Cadastrar Espaço'}
          </button>
        </div>
      </form>

      <div className="mt-6 max-w-4xl overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Descrição</th>
              <th className="p-3">Capacidade</th>
              <th className="p-3">Valor / Hora</th>
            </tr>
          </thead>
          <tbody>
            {espacos.map((espaco) => (
              <tr key={espaco.id} className="border-t">
                <td className="p-3">#{espaco.id}</td>
                <td className="p-3 font-semibold">{espaco.nome}</td>
                <td className="p-3">{espaco.descricao}</td>
                <td className="p-3">{espaco.capacidade} pessoas</td>
                <td className="p-3 text-teal-700 font-medium">R$ {espaco.valorPorHora.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ); 
}
