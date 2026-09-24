import { StatusReserva } from '@/types/reserva';

const estilos: Record<StatusReserva, string> = { 
  PENDENTE: 'bg-blue-100 text-blue-800', 
  CONFIRMADA: 'bg-cyan-100 text-cyan-800', 
  EM_ANDAMENTO: 'bg-amber-100 text-amber-800', 
  FINALIZADA: 'bg-emerald-100 text-emerald-800', 
  CANCELADA: 'bg-rose-100 text-rose-800' 
};

export function ReservaStatusBadge({ status }: { status?: StatusReserva }) { 
  if (!status) return null;
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${estilos[status] || 'bg-gray-100'}`}>{status.replace('_', ' ')}</span>; 
}
