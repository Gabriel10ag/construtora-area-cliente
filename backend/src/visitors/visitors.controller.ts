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
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { CreateVisitDto } from './dto/create-visit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('visitors')
@UseGuards(JwtAuthGuard)
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  createVisitor(@Body() dto: CreateVisitorDto) {
    return this.visitorsService.createVisitor(dto);
  }

  @Get()
  findVisitors() {
    return this.visitorsService.findVisitors();
  }

  @Post('visits')
  createVisit(@Req() req: any, @Body() dto: CreateVisitDto) {
    const residentId = req.user.id;
    return this.visitorsService.createVisit(residentId, dto);
  }

  @Get('visits/my')
  findMyVisits(@Req() req: any) {
    const residentId = req.user.id;
    return this.visitorsService.findVisitsByResident(residentId);
  }

  @Get('visits')
  findAllVisits() {
    return this.visitorsService.findAllVisits();
  }

  @Patch('visits/:id/status/:status')
  updateVisitStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string,
  ) {
    return this.visitorsService.updateVisitStatus(id, status);
  }
}
