import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { EspacosService } from './espacos.service';
import { CreateEspacoDto } from './dto/create-espaco.dto';

@Controller('espacos')
export class EspacosController { 
  constructor(private readonly espacosService: EspacosService) {} 
  @Get() findAll() { return this.espacosService.findAll(); } 
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.espacosService.findOne(id); } 
  @Post() create(@Body() dto: CreateEspacoDto) { return this.espacosService.create(dto); }
}
