import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @IsInt()
  unitId: number;

  @IsOptional()
  @IsInt()
  recipientId?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  carrier?: string;
}
