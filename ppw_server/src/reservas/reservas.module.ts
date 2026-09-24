import { Module } from '@nestjs/common';
import { EspacosModule } from '../espacos/espacos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
@Module({ imports: [UsuariosModule, EspacosModule], controllers: [ReservasController], providers: [ReservasService] }) export class ReservasModule {}
