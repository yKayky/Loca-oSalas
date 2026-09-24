import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EspacosService } from '../espacos/espacos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Reserva, StatusReserva } from './reserva.interface';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  private reservas: Reserva[] = [
    { id: 1, usuarioId: 1, espacoId: 1, data: '2026-09-20', horarioInicio: '08:00', horarioFim: '10:00', status: 'CONFIRMADA', createdAt: '2026-09-01T10:00:00.000Z', updatedAt: '2026-09-01T10:00:00.000Z' },
    { id: 2, usuarioId: 2, espacoId: 2, data: '2026-09-20', horarioInicio: '09:00', horarioFim: '11:00', status: 'PENDENTE', createdAt: '2026-09-01T10:00:00.000Z', updatedAt: '2026-09-01T10:00:00.000Z' },
    { id: 3, usuarioId: 3, espacoId: 3, data: '2026-09-21', horarioInicio: '10:00', horarioFim: '12:00', status: 'EM_ANDAMENTO', checkInReal: '2026-09-21T10:05:00.000Z', createdAt: '2026-09-01T10:00:00.000Z', updatedAt: '2026-09-01T10:00:00.000Z' },
  ];

  constructor(private readonly usuariosService: UsuariosService, private readonly espacosService: EspacosService) {}

  findAll() { return this.reservas; }

  findOne(id: number) { 
    const reserva = this.reservas.find((item) => item.id === id); 
    if (!reserva) throw new NotFoundException('Reserva não encontrada.'); 
    return reserva; 
  }

  create(dto: CreateReservaDto) {
    this.usuariosService.findOne(dto.usuarioId); 
    this.espacosService.findOne(dto.espacoId); 
    
    this.validarHorarios(dto.horarioInicio, dto.horarioFim);
    this.validarConflito(dto.espacoId, dto.data, dto.horarioInicio, dto.horarioFim);
    
    const agora = new Date().toISOString(); 
    const reserva: Reserva = { 
      id: this.proximoId(), 
      ...dto, 
      status: 'PENDENTE', 
      createdAt: agora, 
      updatedAt: agora 
    };
    this.reservas.push(reserva); 
    return reserva;
  }

  update(id: number, dto: UpdateReservaDto) {
    const reserva = this.findOne(id); 
    const usuarioId = dto.usuarioId ?? reserva.usuarioId; 
    const espacoId = dto.espacoId ?? reserva.espacoId;
    const data = dto.data ?? reserva.data; 
    const horarioInicio = dto.horarioInicio ?? reserva.horarioInicio;
    const horarioFim = dto.horarioFim ?? reserva.horarioFim;
    
    this.usuariosService.findOne(usuarioId); 
    const espaco = this.espacosService.findOne(espacoId);
    
    this.validarHorarios(horarioInicio, horarioFim);

    if (dto.status && dto.status !== reserva.status) {
      this.validarTransicao(reserva.status, dto.status);

      // Lógica de Check-in
      if (dto.status === 'EM_ANDAMENTO' && reserva.status !== 'EM_ANDAMENTO') {
        reserva.checkInReal = new Date().toISOString();
      }

      // Lógica de Check-out
      if (dto.status === 'FINALIZADA' && reserva.status === 'EM_ANDAMENTO') {
        reserva.checkOutReal = new Date().toISOString();
        const checkOutDate = new Date(reserva.checkOutReal);
        const [horasFim, minutosFim] = reserva.horarioFim.split(':').map(Number);
        
        // Monta a data/hora final prevista para hoje (baseada na data da reserva)
        // Como 'data' é YYYY-MM-DD
        const dataPrevista = new Date(`${reserva.data}T${reserva.horarioFim}:00.000Z`);
        
        const diffEmMs = checkOutDate.getTime() - dataPrevista.getTime();
        
        if (diffEmMs > 0) {
          const diffMinutos = Math.ceil(diffEmMs / (1000 * 60));
          reserva.tempoExcedenteMinutos = diffMinutos;
          const valorMinuto = espaco.valorPorHora / 60;
          reserva.valorExcedente = Number((diffMinutos * valorMinuto).toFixed(2));
        } else {
          reserva.tempoExcedenteMinutos = 0;
          reserva.valorExcedente = 0;
        }
      }
    }

    this.validarConflito(espacoId, data, horarioInicio, horarioFim, id);
    Object.assign(reserva, { ...dto, usuarioId, espacoId, data, horarioInicio, horarioFim, updatedAt: new Date().toISOString() }); 
    return reserva;
  }

  sincronizar(reservas: Reserva[]) {
    if (!Array.isArray(reservas) || !reservas.every((item) => this.reservaValida(item))) throw new BadRequestException('Lista de reservas inválida.');
    this.reservas = reservas.map((reserva) => ({ ...reserva })); 
    return this.reservas;
  }

  private proximoId() { 
    return this.reservas.reduce((maior, reserva) => Math.max(maior, reserva.id), 0) + 1; 
  }

  private validarHorarios(inicio: string, fim: string) {
    if (inicio >= fim) throw new BadRequestException('O horário de fim deve ser maior que o horário de início.');
  }

  private validarConflito(espacoId: number, data: string, horarioInicio: string, horarioFim: string, ignorarId?: number) {
    const conflito = this.reservas.some((reserva) => {
      if (reserva.id === ignorarId || reserva.status === 'CANCELADA' || reserva.status === 'FINALIZADA') return false;
      if (reserva.espacoId !== espacoId || reserva.data !== data) return false;
      
      // Verifica intersecção de intervalos (se um começa antes do outro terminar e vice-versa)
      return (horarioInicio < reserva.horarioFim && horarioFim > reserva.horarioInicio);
    });
    if (conflito) throw new ConflictException('O espaço já possui uma reserva conflitante neste horário.');
  }

  private validarTransicao(atual: StatusReserva, proximo: StatusReserva) {
    const permitidas: Record<StatusReserva, StatusReserva[]> = { 
      PENDENTE: ['CONFIRMADA', 'EM_ANDAMENTO', 'CANCELADA'], 
      CONFIRMADA: ['EM_ANDAMENTO', 'CANCELADA'], 
      EM_ANDAMENTO: ['FINALIZADA'], 
      FINALIZADA: [], 
      CANCELADA: [] 
    };
    if (!permitidas[atual].includes(proximo)) throw new BadRequestException(`Transição inválida: ${atual} para ${proximo}.`);
  }

  private reservaValida(reserva: Reserva) { 
    return Number.isInteger(reserva.id) && 
           Number.isInteger(reserva.usuarioId) && 
           Number.isInteger(reserva.espacoId) && 
           /^\d{4}-\d{2}-\d{2}$/.test(reserva.data) && 
           /^\d{2}:\d{2}$/.test(reserva.horarioInicio) && 
           /^\d{2}:\d{2}$/.test(reserva.horarioFim) && 
           ['PENDENTE', 'CONFIRMADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'].includes(reserva.status) && 
           typeof reserva.createdAt === 'string' && 
           typeof reserva.updatedAt === 'string'; 
  }
}
