import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { OccurrencesService } from './occurrences.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceStatusDto } from './dto/update-occurrence-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('occurrences')
@UseGuards(JwtAuthGuard)
export class OccurrencesController {
  constructor(private readonly occurrencesService: OccurrencesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateOccurrenceDto) {
    const userId = req.user.id;
    return this.occurrencesService.create(userId, dto);
  }

  @Get('my')
  findMy(@Req() req: any) {
    const userId = req.user.id;
    return this.occurrencesService.findByUser(userId);
  }

  @Get()
  findAll() {
    return this.occurrencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.occurrencesService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOccurrenceStatusDto,
  ) {
    return this.occurrencesService.updateStatus(id, dto);
  }
}
