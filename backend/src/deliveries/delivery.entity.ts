import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Unit } from '../units/unit.entity';
import { User } from '../users/user.entity';

export type DeliveryStatus = 'pending' | 'notified' | 'picked_up';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Unit, { eager: true })
  unit: Unit;

  @ManyToOne(() => User, { eager: true, nullable: true })
  recipient?: User; // se já tiver vinculado a um morador específico

  @Column()
  description: string; // Ex: "Caixa da Amazon", "Carta registrada"

  @Column({ nullable: true })
  carrier?: string; // Transportadora, Correios, etc.

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: DeliveryStatus;

  @Column({ type: 'timestamp', nullable: true })
  pickedUpAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
    