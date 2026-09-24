import { Injectable, NotFoundException } from '@nestjs/common';
import { Espaco } from './espaco.interface';

@Injectable()
export class EspacosService {
  private readonly espacos: Espaco[] = [];

  findAll() { return this.espacos; }

  findOne(id: number) {
    const espaco = this.espacos.find((item) => item.id === id);
    if (!espaco) throw new NotFoundException('Espaço não encontrado.');
    return espaco;
  }

  create(dto: Omit<Espaco, 'id'>) {
    const id = this.espacos.reduce((maior, espaco) => Math.max(maior, espaco.id), 0) + 1;
    const novo = { id, ...dto };
    this.espacos.push(novo);
    return novo;
  }
}
