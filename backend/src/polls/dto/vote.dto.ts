import { IsInt, IsNotEmpty } from 'class-validator';

export class VoteDto {
  @IsInt()
  @IsNotEmpty()
  optionId: number;
}
