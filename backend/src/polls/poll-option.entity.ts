// backend/src/polls/poll-option.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Poll } from './poll.entity';

@Entity('poll_options')
export class PollOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'poll_id' })
  pollId: number;

  @ManyToOne(() => Poll, (poll) => poll.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @Column({ length: 255 })
  label: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
