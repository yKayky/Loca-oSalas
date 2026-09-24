import { Test } from '@nestjs/testing';
import { EspacosModule } from '../espacos/espacos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ReservasService } from './reservas.service';

describe('ReservasService', () => {
  let service: ReservasService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [UsuariosModule, EspacosModule],
      providers: [ReservasService],
    }).compile();
    service = module.get(ReservasService);
  });

  it('cria uma reserva com status PENDENTE', () => {
    const reserva = service.create({
      usuarioId: 1,
      espacoId: 4,
      data: '2026-10-01',
      horarioInicio: '09:00',
      horarioFim: '10:00',
    });
    expect(reserva.status).toBe('PENDENTE');
  });

  it('rejeita horário ocupado para o mesmo espaço', () => {
    expect(() =>
      service.create({
        usuarioId: 3,
        espacoId: 1,
        data: '2026-09-20',
        horarioInicio: '08:00',
        horarioFim: '09:00',
      }),
    ).toThrow('O espaço já possui uma reserva conflitante neste horário.');
  });

  it('aceita uma transição válida', () => {
    expect(service.update(2, { status: 'CONFIRMADA' }).status).toBe('CONFIRMADA');
  });

  it('rejeita uma transição inválida', () => {
    expect(() => service.update(1, { status: 'FINALIZADA' })).toThrow('Transição inválida');
  });
});
