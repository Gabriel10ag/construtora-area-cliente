import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { TicketMessage } from './ticket-message.entity';
import { User } from '../users/user.entity';
import { Contract } from '../contracts/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketMessage, User, Contract])],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
