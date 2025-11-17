import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateVisitDto {
  @IsInt()
  unitId: number;

  @IsInt()
  visitorId: number; // ou vc pode optar por criar visitante junto

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
