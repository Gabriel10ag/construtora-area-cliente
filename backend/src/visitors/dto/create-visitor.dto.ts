import { IsOptional, IsString } from 'class-validator';

export class CreateVisitorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
