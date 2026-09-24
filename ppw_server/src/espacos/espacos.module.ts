import { Module } from '@nestjs/common'; import { EspacosController } from './espacos.controller'; import { EspacosService } from './espacos.service';
@Module({ controllers: [EspacosController], providers: [EspacosService], exports: [EspacosService] }) export class EspacosModule {}
