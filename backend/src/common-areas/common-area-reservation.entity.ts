import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { CommonArea } from './common-area.entity';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

@Entity('common_area_reservations')
export class CommonAreaReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommonArea, (area) => area.reservations, {
    eager: true,
  })
  commonArea: CommonArea;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Unit, { eager: true })
  unit: Unit;

  @Column({ type: 'timestamp' })
  startDateTime: Date;

  @Column({ type: 'timestamp' })
  endDateTime: Date;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ReservationStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
}
