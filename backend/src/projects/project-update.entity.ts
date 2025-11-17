import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_updates')
export class ProjectUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.updates)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  // usa a coluna que existe no banco: media_url
  @Column({
    name: 'media_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  mediaUrl: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
