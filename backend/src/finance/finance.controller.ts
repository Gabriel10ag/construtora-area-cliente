import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('contracts/:id/installments')
  async getInstallmentsByContract(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const installments = await this.financeService.findByContractId(id);

    return installments.map((i) => ({
      id: i.id,
      number: i.number,
      dueDate: i.dueDate,
      amount: i.amount,
      status: i.status,
      paidAt: i.paidAt,
      documentUrl: i.documentUrl,
    }));
  }
}
