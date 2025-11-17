import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
  ) {}

  async findByUserId(userId: number): Promise<Contract[]> {
    return this.contractsRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['installments', 'user'], // sem 'unit', 'block', 'project'
      order: {
        id: 'DESC',
      },
    });
  }

  async findOneById(id: number): Promise<Contract | null> {
    return this.contractsRepository.findOne({
      where: { id },
      relations: ['installments', 'user'],
    });
  }
}
