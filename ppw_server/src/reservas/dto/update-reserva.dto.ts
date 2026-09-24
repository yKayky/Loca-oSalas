import { IsIn, IsInt, IsOptional, Matches } from 'class-validator';
import { StatusReserva } from '../reserva.interface';

export class UpdateReservaDto {
  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsInt()
  espacoId?: number;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  data?: string;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  horarioInicio?: string;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  horarioFim?: string;

  @IsOptional()
  @IsIn(['PENDENTE', 'CONFIRMADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'])
  status?: StatusReserva;
}
