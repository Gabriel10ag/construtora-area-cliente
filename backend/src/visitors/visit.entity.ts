import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Visitor } from './visitor.entity';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

export type VisitStatus = 'scheduled' | 'authorized' | 'in_building' | 'finished' | 'denied';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Visitor, (visitor) => visitor.visits, {
    eager: true,
  })
  visitor: Visitor;

  @ManyToOne(() => User, { eager: true })
  resident: User; // morador que autorizou

  @ManyToOne(() => Unit, { eager: true })
  unit: Unit;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status: VisitStatus;

  @Column({ nullable: true })
  plate?: string; // placa do veículo

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
}
