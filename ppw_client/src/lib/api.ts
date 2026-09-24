import { Reserva, DadosReserva, Espaco, Usuario } from '@/types/reserva';

const API_URL = 'http://localhost:8000';

async function requisicao<T>(caminho: string, opcoes?: RequestInit): Promise<T> { 
  try { 
    const resposta = await fetch(`${API_URL}${caminho}`, { 
      headers: { 'Content-Type': 'application/json' }, 
      ...opcoes 
    }); 
    if (!resposta.ok) { 
      const erro = await resposta.json().catch(() => ({})); 
      throw new Error(Array.isArray(erro.message) ? erro.message.join(', ') : erro.message || 'Não foi possível concluir a solicitação.'); 
    } 
    return resposta.json() as Promise<T>; 
  } catch (erro) { 
    if (erro instanceof TypeError) throw new Error('Backend indisponível. Verifique se a API está em execução na porta 8000.'); 
    throw erro; 
  } 
}

export const buscarReservas = () => requisicao<Reserva[]>('/reservas');
export const buscarReservaPorId = (id: number) => requisicao<Reserva>(`/reservas/${id}`);
export const criarReserva = (dados: DadosReserva) => requisicao<Reserva>('/reservas', { method: 'POST', body: JSON.stringify(dados) });
export const atualizarReserva = (id: number, dados: Partial<DadosReserva & Pick<Reserva, 'status'>>) => requisicao<Reserva>(`/reservas/${id}`, { method: 'PATCH', body: JSON.stringify(dados) });
export const sincronizarReservas = (reservas: Reserva[]) => requisicao<Reserva[]>('/reservas/sincronizar', { method: 'PUT', body: JSON.stringify(reservas) });

export const buscarUsuarios = () => requisicao<Usuario[]>('/usuarios'); 
export const buscarUsuarioPorId = (id: number) => requisicao<Usuario>(`/usuarios/${id}`);
export const criarUsuario = (dados: Omit<Usuario, 'id'>) => requisicao<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(dados) });

export const buscarEspacos = () => requisicao<Espaco[]>('/espacos'); 
export const buscarEspacoPorId = (id: number) => requisicao<Espaco>(`/espacos/${id}`);
export const criarEspaco = (dados: Omit<Espaco, 'id'>) => requisicao<Espaco>('/espacos', { method: 'POST', body: JSON.stringify(dados) });
