import { Injectable, NotFoundException } from '@nestjs/common';
import { Espaco } from './espaco.interface';

@Injectable()
export class EspacosService {
  private readonly espacos: Espaco[] = [
    { id: 1, nome: 'Sala Focus', descricao: 'Sala silenciosa para foco total', capacidade: 2, localizacao: 'Andar 1', valorPorHora: 35.0 },
    { id: 2, nome: 'Sala Criativa', descricao: 'Sala com quadro branco e projetor', capacidade: 8, localizacao: 'Andar 2', valorPorHora: 60.0 },
    { id: 3, nome: 'Mesa Compartilhada 1', descricao: 'Mesa em ambiente aberto', capacidade: 1, localizacao: 'Andar 1', valorPorHora: 15.0 },
    { id: 4, nome: 'Auditório', descricao: 'Espaço para palestras e eventos', capacidade: 50, localizacao: 'Térreo', valorPorHora: 150.0 }
  ];

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
