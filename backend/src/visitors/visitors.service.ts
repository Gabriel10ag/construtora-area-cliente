import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitor.entity';
import { Visit } from './visit.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { CreateVisitDto } from './dto/create-visit.dto';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepo: Repository<Visitor>,
    @InjectRepository(Visit)
    private readonly visitRepo: Repository<Visit>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
  ) {}

  createVisitor(dto: CreateVisitorDto) {
    const visitor = this.visitorRepo.create(dto);
    return this.visitorRepo.save(visitor);
  }

  findVisitors() {
    return this.visitorRepo.find();
  }

  async findVisitorById(id: number) {
    const visitor = await this.visitorRepo.findOne({ where: { id } });
    if (!visitor) throw new NotFoundException('Visitante não encontrado.');
    return visitor;
  }

  async createVisit(residentId: number, dto: CreateVisitDto) {
    const visitor = await this.findVisitorById(dto.visitorId);

    const resident = await this.userRepo.findOne({ where: { id: residentId } });
    if (!resident) throw new NotFoundException('Morador não encontrado.');

    const unit = await this.unitRepo.findOne({ where: { id: dto.unitId } });
    if (!unit) throw new NotFoundException('Unidade não encontrada.');

    const visit = this.visitRepo.create({
      visitor,
      resident,
      unit,
      scheduledAt: new Date(dto.scheduledAt),
      plate: dto.plate,
      notes: dto.notes,
      status: 'scheduled',
    });

    return this.visitRepo.save(visit);
  }

  findVisitsByResident(residentId: number) {
    return this.visitRepo.find({
      where: { resident: { id: residentId } },
      order: { scheduledAt: 'DESC' },
    });
  }

  findAllVisits() {
    return this.visitRepo.find({ order: { scheduledAt: 'DESC' } });
  }

  async updateVisitStatus(id: number, status: string) {
    const visit = await this.visitRepo.findOne({ where: { id } });
    if (!visit) throw new NotFoundException('Visita não encontrada.');
    visit.status = status as any;
    return this.visitRepo.save(visit);
  }
}
