import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateReservationStatusDto {
  @IsIn(['pending', 'approved', 'rejected', 'cancelled'])
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';

  @IsOptional()
  @IsString()
  notes?: string;
}
