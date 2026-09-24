import { Injectable, NotFoundException } from '@nestjs/common';
import { Usuario } from './usuario.interface';

@Injectable()
export class UsuariosService {
  private readonly usuarios: Usuario[] = [
    { id: 1, nome: 'Maria Silva' }, { id: 2, nome: 'Pedro Almeida' },
    { id: 3, nome: 'Lara Costa' }, { id: 4, nome: 'Rafael Lima' },
  ];
  findAll() { return this.usuarios; }
  findOne(id: number) { const usuario = this.usuarios.find((item) => item.id === id); if (!usuario) throw new NotFoundException('Usuário não encontrado.'); return usuario; }
  create(dto: { nome: string }) { 
    const id = this.usuarios.reduce((maior, usuario) => Math.max(maior, usuario.id), 0) + 1;
    const novo = { id, ...dto };
    this.usuarios.push(novo);
    return novo;
  }
}
