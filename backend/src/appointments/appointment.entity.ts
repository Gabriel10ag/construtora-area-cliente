// backend/src/appointments/appointment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Contract } from '../contracts/contract.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contract, { eager: true })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type?: string | null;

  @Column({ name: 'scheduled_for', type: 'datetime' })
  scheduledFor: Date;

  @Column({ type: 'varchar', length: 30, default: 'SCHEDULED' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
