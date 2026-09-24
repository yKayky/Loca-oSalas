import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsuariosController { 
  constructor(private readonly usuariosService: UsuariosService) {} 
  @Get() findAll() { return this.usuariosService.findAll(); } 
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.usuariosService.findOne(id); } 
  @Post() create(@Body() dto: CreateUsuarioDto) { return this.usuariosService.create(dto); }
}
