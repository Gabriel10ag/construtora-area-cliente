import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { Unit } from './unit.entity';

@Entity('blocks')
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => Project, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project | null;

  @OneToMany(() => Unit, (unit) => unit.block)
  units: Unit[];
}
