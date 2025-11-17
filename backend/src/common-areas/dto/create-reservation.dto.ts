import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  commonAreaId: number;

  @IsInt()
  unitId: number;

  @IsDateString()
  startDateTime: string;

  @IsDateString()
  endDateTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
