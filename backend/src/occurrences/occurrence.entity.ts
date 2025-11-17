import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

export type OccurrenceStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

@Entity('occurrences')
export class Occurrence {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Unit, { eager: true })
  unit: Unit;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  category?: string; // barulho, limpeza, portaria, etc.

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: OccurrenceStatus;

  @CreateDateColumn()
  createdAt: Date;
}
