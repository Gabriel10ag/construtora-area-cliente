import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CommonAreasService } from './common-areas.service';
import { CreateCommonAreaDto } from './dto/create-common-area.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('common-areas')
@UseGuards(JwtAuthGuard)
export class CommonAreasController {
  constructor(private readonly commonAreasService: CommonAreasService) {}

  // ÁREAS

  @Post()
  createArea(@Body() dto: CreateCommonAreaDto) {
    return this.commonAreasService.createArea(dto);
  }

  @Get()
  findAllAreas() {
    return this.commonAreasService.findAllAreas();
  }

  @Get(':id')
  findAreaById(@Param('id', ParseIntPipe) id: number) {
    return this.commonAreasService.findAreaById(id);
  }

  @Patch(':id')
  updateArea(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateCommonAreaDto>,
  ) {
    return this.commonAreasService.updateArea(id, dto);
  }

  @Delete(':id')
  deleteArea(@Param('id', ParseIntPipe) id: number) {
    return this.commonAreasService.deleteArea(id);
  }

  // RESERVAS

  @Post('reservations')
  createReservation(@Req() req: any, @Body() dto: CreateReservationDto) {
    const userId = req.user.id;
    return this.commonAreasService.createReservation(userId, dto);
  }

  @Get('reservations/my')
  getMyReservations(@Req() req: any) {
    const userId = req.user.id;
    return this.commonAreasService.findReservationsByUser(userId);
  }

  @Get(':id/reservations')
  getReservationsByArea(@Param('id', ParseIntPipe) id: number) {
    return this.commonAreasService.findReservationsByArea(id);
  }

  @Patch('reservations/:id/status')
  updateReservationStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.commonAreasService.updateReservationStatus(id, dto);
  }
}
