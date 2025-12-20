import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ErrorGroup } from './error-group.entity';
import { User } from '../../users/entities/user.entity';

@Entity('error_comments')
export class ErrorComment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => ErrorGroup, (errorGroup) => errorGroup.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'error_group_id' })
  errorGroup: ErrorGroup;

  @Column({ name: 'error_group_id' })
  errorGroupId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ default: false })
  isInternal: boolean; // If true, only admins can see it
}

