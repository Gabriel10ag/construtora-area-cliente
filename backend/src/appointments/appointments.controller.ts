// backend/src/appointments/appointments.controller.ts
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

interface AuthRequest extends Request {
  user?: any;
}

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  private getUserIdFromRequest(req: AuthRequest): number {
    // cobre variações comuns de payload do JWT: { userId }, { sub }, { id }
    const user =
      (req as any).user ??
      (req as any).request?.user ??
      (req as any).req?.user ??
      {};
    return user.userId ?? user.id ?? user.sub;
  }

  @Get()
  async list(@Req() req: AuthRequest) {
    const userId = this.getUserIdFromRequest(req);
    return this.appointmentsService.listAppointmentsForUser(userId);
  }

  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateAppointmentDto) {
    const userId = this.getUserIdFromRequest(req);
    return this.appointmentsService.createAppointmentForUser(userId, dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    const userId = this.getUserIdFromRequest(req);
    return this.appointmentsService.updateStatusForUser(userId, id, dto);
  }

  @Patch(':id/cancel')
  async cancel(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = this.getUserIdFromRequest(req);
    return this.appointmentsService.cancelForUser(userId, id);
  }
}
