import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Installment } from '../finance/installment.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  // Relacionamento com o usuário (cliente que comprou)
  @ManyToOne(() => User, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  // Apenas a coluna unit_id, sem relação com Unit por enquanto
  @Column({ name: 'unit_id', type: 'int', nullable: true })
  unitId: number | null;

  @Column({ name: 'contract_number', type: 'varchar', length: 100, nullable: true })
  contractNumber: string | null;

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  totalValue: string; // TypeORM costuma tratar decimal como string

  @Column({ name: 'financing_type', type: 'varchar', length: 50, nullable: true })
  financingType: string | null;

  @Column({ name: 'status', type: 'varchar', length: 30, default: 'ATIVO' })
  status: string;

  @Column({ name: 'signed_at', type: 'datetime', nullable: true })
  signedAt: Date | null;

  // Parcelas do contrato
  @OneToMany(() => Installment, (installment) => installment.contract)
  installments: Installment[];
}
