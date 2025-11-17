// backend/src/tickets/ticket-message.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('ticket_messages')
export class TicketMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.messages)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ name: 'sender_type', length: 20, nullable: true })
  senderType?: string; // 'USER' | 'STAFF'

  @Column({ name: 'sender_id', nullable: true })
  senderId?: number;

  @Column('text', { nullable: true })
  message?: string;

  @Column({ name: 'attachment_url', length: 500, nullable: true })
  attachmentUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
