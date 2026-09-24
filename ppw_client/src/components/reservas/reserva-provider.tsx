'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { buscarReservas, buscarEspacos, buscarUsuarios, criarReserva as criarNaApi, atualizarReserva as atualizarNaApi, sincronizarReservas, criarUsuario, criarEspaco } from '@/lib/api';

import { Reserva, DadosReserva, Espaco, Usuario, StatusReserva } from '@/types/reserva';

type Contexto = { 
  reservas: Reserva[]; 
  usuarios: Usuario[]; 
  espacos: Espaco[]; 
  loading: boolean; 
  error: string; 
  criarReserva: (dados: DadosReserva) => Promise<Reserva>; 
  editarReserva: (id: number, dados: Partial<Reserva>) => Promise<Reserva>; 
  alterarStatus: (id: number, status: StatusReserva) => Promise<Reserva>; 
  adicionarUsuario: (nome: string) => Promise<Usuario>;
  adicionarEspaco: (dados: Omit<Espaco, 'id'>) => Promise<Espaco>;
};

const ReservaContext = createContext<Contexto | null>(null);

export function ReservaProvider({ children }: { children: ReactNode }) { 
  const [reservas, setReservas] = useState<Reserva[]>([]); 
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); 
  const [espacos, setEspacos] = useState<Espaco[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');



  useEffect(() => { 
    async function iniciar() { 
      try { 
        const [catalogoUsuarios, catalogoEspacos, listaReservas] = await Promise.all([
          buscarUsuarios(), 
          buscarEspacos(),
          buscarReservas()
        ]); 
        setUsuarios(catalogoUsuarios); 
        setEspacos(catalogoEspacos); 
        setReservas(listaReservas); 
      } catch (erro) { 
        setError(erro instanceof Error ? erro.message : 'Não foi possível carregar os dados.'); 
      } finally { 
        setLoading(false); 
      } 
    } 
    void iniciar(); 
  }, []);

  async function criarReserva(dados: DadosReserva) { 
    const reserva = await criarNaApi(dados); 
    setReservas((prev) => [...prev, reserva]); 
    return reserva; 
  }

  async function editarReserva(id: number, dados: Partial<Reserva>) { 
    const reserva = await atualizarNaApi(id, dados); 
    setReservas((prev) => prev.map((item) => item.id === id ? reserva : item)); 
    return reserva; 
  }

  async function alterarStatus(id: number, status: StatusReserva) { 
    const reserva = await atualizarNaApi(id, { status }); 
    setReservas((prev) => prev.map((item) => item.id === id ? reserva : item)); 
    return reserva; 
  }

  async function adicionarUsuario(nome: string) {
    const usuario = await criarUsuario({ nome });
    setUsuarios([...usuarios, usuario]);
    return usuario;
  }

  async function adicionarEspaco(dados: Omit<Espaco, 'id'>) {
    const espaco = await criarEspaco(dados);
    setEspacos([...espacos, espaco]);
    return espaco;
  }

  return <ReservaContext.Provider value={{ reservas, usuarios, espacos, loading, error, criarReserva, editarReserva, alterarStatus, adicionarUsuario, adicionarEspaco }}>{children}</ReservaContext.Provider>; 
}

export function useReservas() { 
  const contexto = useContext(ReservaContext); 
  if (!contexto) throw new Error('useReservas deve ser usado dentro de ReservaProvider.'); 
  return contexto; 
}
