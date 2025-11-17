// backend/src/polls/poll.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { PollOption } from './poll-option.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ length: 20, default: 'OPEN' })
  status: string; // OPEN | CLOSED

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @OneToMany(
    () => PollOption,
    (option: PollOption) => option.poll,
    {
      eager: true,
      cascade: true,
    },
  )
  options: PollOption[];
}
