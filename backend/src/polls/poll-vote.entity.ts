import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Poll } from './poll.entity';
import { PollOption } from './poll-option.entity';
import { User } from '../users/user.entity';

@Entity('poll_votes')
export class PollVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'poll_id' })
  pollId: number;

  @ManyToOne(() => Poll, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @Column({ name: 'option_id' })
  optionId: number;

  @ManyToOne(() => PollOption, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: PollOption;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
    