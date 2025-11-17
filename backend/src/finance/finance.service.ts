import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Installment } from './installment.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Installment)
    private readonly installmentsRepo: Repository<Installment>,
  ) {}

  async findByContractId(contractId: number): Promise<Installment[]> {
    return this.installmentsRepo.find({
      where: { contract: { id: contractId } },
      order: { number: 'ASC' },
    });
  }
}
