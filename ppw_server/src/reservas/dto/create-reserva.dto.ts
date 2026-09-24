import { IsInt, IsNotEmpty, Matches } from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  usuarioId!: number;

  @IsInt()
  espacoId!: number;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  data!: string;

  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/)
  horarioInicio!: string;

  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/)
  horarioFim!: string;
}
