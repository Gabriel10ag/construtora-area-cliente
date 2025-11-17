import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occurrence } from './occurrence.entity';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceStatusDto } from './dto/update-occurrence-status.dto';
import { User } from '../users/user.entity';
import { Unit } from '../units/unit.entity';

@Injectable()
export class OccurrencesService {
  constructor(
    @InjectRepository(Occurrence)
    private readonly occurrenceRepo: Repository<Occurrence>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
  ) {}

  async create(userId: number, dto: CreateOccurrenceDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const unit = await this.unitRepo.findOne({ where: { id: dto.unitId } });
    if (!unit) throw new NotFoundException('Unidade não encontrada.');

    const occurrence = this.occurrenceRepo.create({
      user,
      unit,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      status: 'open',
    });

    return this.occurrenceRepo.save(occurrence);
  }

  findAll() {
    return this.occurrenceRepo.find({ order: { createdAt: 'DESC' } });
  }

  findByUser(userId: number) {
    return this.occurrenceRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const occurrence = await this.occurrenceRepo.findOne({ where: { id } });
    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada.');
    }
    return occurrence;
  }

  async updateStatus(id: number, dto: UpdateOccurrenceStatusDto) {
    const occurrence = await this.findOne(id);
    occurrence.status = dto.status;
    return this.occurrenceRepo.save(occurrence);
  }
}
