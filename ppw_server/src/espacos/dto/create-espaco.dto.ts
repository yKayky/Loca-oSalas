import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEspacoDto {
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @IsNotEmpty()
  @IsString()
  descricao!: string;

  @IsNotEmpty()
  @IsNumber()
  capacidade!: number;

  @IsNotEmpty()
  @IsString()
  localizacao!: string;

  @IsNotEmpty()
  @IsNumber()
  valorPorHora!: number;
}
