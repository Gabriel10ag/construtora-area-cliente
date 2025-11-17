import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOccurrenceDto {
  @IsInt()
  unitId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;
}
