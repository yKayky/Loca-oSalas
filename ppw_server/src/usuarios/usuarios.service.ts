import { Injectable, NotFoundException } from '@nestjs/common';
import { Usuario } from './usuario.interface';

@Injectable()
export class UsuariosService {
  private readonly usuarios: Usuario[] = [];

  findAll() { return this.usuarios; }

  findOne(id: number) {
    const usuario = this.usuarios.find((item) => item.id === id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return usuario;
  }

  create(dto: { nome: string }) {
    const id = this.usuarios.reduce((maior, usuario) => Math.max(maior, usuario.id), 0) + 1;
    const novo = { id, ...dto };
    this.usuarios.push(novo);
    return novo;
  }
}
