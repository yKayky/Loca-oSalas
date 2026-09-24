import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EspacosService } from '../espacos/espacos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Reserva, StatusReserva } from './reserva.interface';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  private reservas: Reserva[] = [];

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly espacosService: EspacosService,
  ) {}

  findAll() {
    return this.reservas;
  }

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
      updatedAt: agora,
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
    this.espacosService.findOne(espacoId);

    this.validarHorarios(horarioInicio, horarioFim);

    if (dto.status && dto.status !== reserva.status) {
      this.validarTransicao(reserva.status, dto.status);

      // Check-in: valida que o horário já chegou
      if (dto.status === 'EM_ANDAMENTO') {
        const agora = new Date();
        const inicioReserva = new Date(`${data}T${horarioInicio}:00`);
        if (agora < inicioReserva) {
          throw new BadRequestException('Não é possível realizar o check-in antes do horário agendado.');
        }
        reserva.checkInReal = agora.toISOString();
      }

      // Check-out: apenas registra o horário real de saída
      if (dto.status === 'FINALIZADA' && reserva.status === 'EM_ANDAMENTO') {
        reserva.checkOutReal = new Date().toISOString();
      }
    }

    this.validarConflito(espacoId, data, horarioInicio, horarioFim, id);
    Object.assign(reserva, {
      ...dto,
      usuarioId,
      espacoId,
      data,
      horarioInicio,
      horarioFim,
      updatedAt: new Date().toISOString(),
    });
    return reserva;
  }

  private proximoId() {
    return this.reservas.reduce((maior, reserva) => Math.max(maior, reserva.id), 0) + 1;
  }

  private validarHorarios(inicio: string, fim: string) {
    if (inicio >= fim) throw new BadRequestException('O horário de fim deve ser maior que o horário de início.');
  }

  private validarConflito(
    espacoId: number,
    data: string,
    horarioInicio: string,
    horarioFim: string,
    ignorarId?: number,
  ) {
    const conflito = this.reservas.some((reserva) => {
      if (reserva.id === ignorarId || reserva.status === 'CANCELADA' || reserva.status === 'FINALIZADA') return false;
      if (reserva.espacoId !== espacoId || reserva.data !== data) return false;
      return horarioInicio < reserva.horarioFim && horarioFim > reserva.horarioInicio;
    });
    if (conflito) throw new ConflictException('O espaço já possui uma reserva conflitante neste horário.');
  }

  private validarTransicao(atual: StatusReserva, proximo: StatusReserva) {
    const permitidas: Record<StatusReserva, StatusReserva[]> = {
      PENDENTE: ['CONFIRMADA', 'EM_ANDAMENTO', 'CANCELADA'],
      CONFIRMADA: ['EM_ANDAMENTO', 'CANCELADA'],
      EM_ANDAMENTO: ['FINALIZADA'],
      FINALIZADA: [],
      CANCELADA: [],
    };
    if (!permitidas[atual].includes(proximo)) {
      throw new BadRequestException(`Transição inválida: ${atual} → ${proximo}.`);
    }
  }
}
