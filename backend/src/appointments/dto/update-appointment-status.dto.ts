import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAppointmentStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  status: string;
}
