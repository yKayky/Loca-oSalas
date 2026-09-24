import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ReservasModule } from '../reservas/reservas.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { EspacosModule } from '../espacos/espacos.module';

@Module({ imports: [ReservasModule, UsuariosModule, EspacosModule], controllers: [AppController] })
export class AppModule {}
