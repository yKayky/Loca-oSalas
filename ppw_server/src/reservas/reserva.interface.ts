export type StatusReserva = 'PENDENTE' | 'CONFIRMADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA';

export interface Reserva {
  id: number;
  usuarioId: number;
  espacoId: number;
  data: string;
  horarioInicio: string; // HH:mm
  horarioFim: string; // HH:mm
  status: StatusReserva;
  createdAt: string;
  updatedAt: string;
  checkInReal?: string; // ISO string
  checkOutReal?: string; // ISO string
  tempoExcedenteMinutos?: number;
  valorExcedente?: number;
}
