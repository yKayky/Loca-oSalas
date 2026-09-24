'use client'; 
import { useState } from 'react';
import { useReservas } from '@/components/reservas/reserva-provider';

export default function PaginaUsuarios() { 
  const { usuarios, loading, error, adicionarUsuario } = useReservas(); 
  const [nome, setNome] = useState('');
  const [salvando, setSalvando] = useState(false);
  
  if (loading) return <p>Carregando usuários...</p>; 
  
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      await adicionarUsuario(nome);
      setNome('');
    } catch (err) {
      alert('Erro ao criar usuário');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Usuários</h1>
      <p className="mt-2 text-slate-600">Membros e locatários cadastrados no sistema de coworking.</p>
      {error && <p className="mt-4 text-rose-700">{error}</p>}
      
      <form onSubmit={onSubmit} className="mt-6 flex gap-3 max-w-xl bg-white p-4 rounded-xl shadow-sm items-end">
        <label className="flex-1 block font-medium">Novo Usuário
          <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" className="mt-1 block w-full rounded border p-2" />
        </label>
        <button disabled={salvando} className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white h-10">
          {salvando ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>

      <div className="mt-6 max-w-xl overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 w-20">ID</th>
              <th className="p-3">Nome</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t">
                <td className="p-3">#{usuario.id}</td>
                <td className="p-3">{usuario.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ); 
}
