import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Block } from './block.entity';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Block, (block) => block.units)
  @JoinColumn({ name: 'block_id' })
  block: Block;

  @Column({ type: 'varchar', length: 50 })
  number: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  floor: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  bedrooms: number | null;

  @Column({
    name: 'private_area_m2',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  privateAreaM2: string | null;

  @Column({
    name: 'parking_spots',
    type: 'int',
    nullable: true,
  })
  parkingSpots: number | null;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'VENDIDO',
  })
  status: string;
}
