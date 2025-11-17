import { IsIn } from 'class-validator';

export class UpdateDeliveryStatusDto {
  @IsIn(['pending', 'notified', 'picked_up'])
  status: 'pending' | 'notified' | 'picked_up';
}
