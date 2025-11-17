import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  // Portaria cadastra encomenda
  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.create(dto);
  }

  // Admin/portaria vê todas
  @Get()
  findAll() {
    return this.deliveriesService.findAll();
  }

  // Morador vê as dele (assumindo que unidade está vinculada ao user em outro lugar)
  @Get('unit/:unitId')
  findByUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    return this.deliveriesService.findByUnit(unitId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeliveryStatusDto,
  ) {
    return this.deliveriesService.updateStatus(id, dto);
  }
}
