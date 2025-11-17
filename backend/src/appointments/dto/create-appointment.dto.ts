import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  contractId: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsNotEmpty()
  @IsDateString()
  scheduledFor: string; // será convertido para Date no service

  @IsOptional()
  @IsString()
  notes?: string;
}
