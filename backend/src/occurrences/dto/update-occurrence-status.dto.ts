import { IsIn } from 'class-validator';

export class UpdateOccurrenceStatusDto {
  @IsIn(['open', 'in_progress', 'resolved', 'closed'])
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}
