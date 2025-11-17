export class CreateTicketDto {
  contractId?: number;
  category?: string;
  subject: string;
  message: string;
}
