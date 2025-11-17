// backend/src/tickets/ticket.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Contract } from '../contracts/contract.entity';
import { TicketMessage } from './ticket-message.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Contract, { nullable: true, eager: true })
  @JoinColumn({ name: 'contract_id' })
  contract?: Contract;

  @Column({ nullable: true, length: 50 })
  category?: string;

  @Column({ nullable: true, length: 255 })
  subject?: string;

  @Column({ length: 30, default: 'OPEN' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => TicketMessage,
    (message: TicketMessage) => message.ticket, // ✅ tipado, não é mais "unknown"
    { cascade: true },
  )
  messages: TicketMessage[];
}
