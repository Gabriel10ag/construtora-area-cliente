import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddMessageDto } from './dto/add-message.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('me')
  async getMyTickets(@Req() req: any) {
    // ajuste aqui conforme o que seu JWT guarda: id, userId, sub...
    const userId = req.user.id ?? req.user.userId ?? req.user.sub;
    return this.ticketsService.findAllForUser(userId);
  }

  @Get(':id')
  async getTicketById(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id ?? req.user.userId ?? req.user.sub;
    return this.ticketsService.findOneForUser(userId, id);
  }

  @Post()
  async createTicket(@Req() req: any, @Body() dto: CreateTicketDto) {
    const userId = req.user.id ?? req.user.userId ?? req.user.sub;
    return this.ticketsService.createForUser(userId, dto);
  }

  @Post(':id/messages')
  async addMessage(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddMessageDto,
  ) {
    const userId = req.user.id ?? req.user.userId ?? req.user.sub;
    return this.ticketsService.addMessageAsUser(userId, id, dto);
  }
}
