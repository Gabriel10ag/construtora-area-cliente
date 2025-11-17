import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ProjectUpdate } from './project-update.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  state: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  address: string;

  @Column({ type: 'varchar', length: 50, default: 'EM_OBRAS' })
  status: string;

  @Column({ name: 'stage', type: 'varchar', length: 50, default: 'EM_OBRAS' })
  stage: string;

  @Column({
    name: 'progress_percent',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  // para DECIMAL o TypeORM geralmente retorna string
  progressPercent: string;

  @Column({
    name: 'hero_image_url',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  heroImageUrl: string;

  @OneToMany(() => ProjectUpdate, (update) => update.project)
  updates: ProjectUpdate[];
}
