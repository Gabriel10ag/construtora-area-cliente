import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCommonAreaDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxReservationsPerDay?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
