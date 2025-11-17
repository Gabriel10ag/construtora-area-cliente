// backend/src/tickets/tickets.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { TicketMessage } from './ticket-message.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { User } from '../users/user.entity';
import { Contract } from '../contracts/contract.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private readonly messageRepo: Repository<TicketMessage>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
  ) {}

  async createForUser(userId: number, dto: CreateTicketDto): Promise<Ticket> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    let contract: Contract | null = null;

    if (dto.contractId) {
      contract = await this.contractRepo.findOne({
        where: { id: dto.contractId },
      });
    }

    const ticket = this.ticketRepo.create({
      user,
      contract: contract ?? undefined, // ✅ ajusta null/undefined
      category: dto.category,
      subject: dto.subject,
      status: 'OPEN',
    });

    const saved = await this.ticketRepo.save(ticket);

    const firstMessage = this.messageRepo.create({
      ticket: saved,
      senderType: 'USER',
      senderId: userId,
      message: dto.message,
    });
    await this.messageRepo.save(firstMessage);

    return this.findOneForUser(userId, saved.id);
  }

  async findAllForUser(userId: number): Promise<Ticket[]> {
    const tickets = await this.ticketRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['messages'],
    });

    // garante mensagens em ordem cronológica
    tickets.forEach((t) => {
      if (t.messages) {
        t.messages = t.messages.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        );
      }
    });

    return tickets;
  }

  async findOneForUser(userId: number, id: number): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['messages'],
    });

    if (!ticket) throw new NotFoundException('Atendimento não encontrado');

    if (ticket.messages) {
      ticket.messages = ticket.messages.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
    }

    return ticket;
  }

  async addMessageAsUser(
    userId: number,
    ticketId: number,
    dto: AddMessageDto,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId, user: { id: userId } },
    });

    if (!ticket) throw new NotFoundException('Atendimento não encontrado');

    const msg = this.messageRepo.create({
      ticket,
      senderType: 'USER',
      senderId: userId,
      message: dto.message,
    });
    await this.messageRepo.save(msg);

    return this.findOneForUser(userId, ticketId);
  }

  // pensado para uso futuro no painel interno (staff)
  async updateStatusAsStaff(
    ticketId: number,
    dto: UpdateTicketStatusDto,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
    });

    if (!ticket) throw new NotFoundException('Atendimento não encontrado');

    ticket.status = dto.status;
    await this.ticketRepo.save(ticket);

    const updated = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['messages'],
    });

    if (!updated) {
      // dificil acontecer, mas só pra deixar o TS feliz
      throw new NotFoundException('Atendimento não encontrado após atualização');
    }

    if (updated.messages) {
      updated.messages = updated.messages.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
    }

    return updated;
  }
}
