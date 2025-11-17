import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Visit } from './visit.entity';

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  document?: string; // RG, CPF, etc.

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => Visit, (visit) => visit.visitor)
  visits: Visit[];
}
