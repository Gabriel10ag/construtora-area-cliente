import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyContracts(@Req() req: any) {
    const user = req.user as { userId: number; email: string; name: string };

    const contracts = await this.contractsService.findByUserId(user.userId);

    return contracts.map((c) => ({
      id: c.id,
      contractNumber: c.contractNumber,
      status: c.status,
      totalValue: c.totalValue,
      financingType: c.financingType,
      signedAt: c.signedAt,

      // agora só expomos o ID da unidade
      unitId: c.unitId,

      // parcelas do contrato
      installments: c.installments
        ? c.installments.map((i) => ({
            id: i.id,
            number: i.number,
            dueDate: i.dueDate,
            amount: i.amount,      // nome do campo na entity Installment
            status: i.status,
            paidAt: i.paidAt,
            documentUrl: i.documentUrl,
          }))
        : [],
    }));
  }
}
