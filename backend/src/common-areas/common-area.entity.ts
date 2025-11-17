import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { CommonAreaReservation } from './common-area-reservation.entity';

@Entity('common_areas')
export class CommonArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Salão de Festas, Churrasqueira, etc.

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'int', default: 1 })
  maxReservationsPerDay: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(
    () => CommonAreaReservation,
    (reservation) => reservation.commonArea,
  )
  reservations: CommonAreaReservation[];
}
