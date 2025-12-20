import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { ErrorGroup } from '../../errors/entities/error-group.entity';

export enum NotificationType {
  ERROR_STATUS_CHANGED = 'error_status_changed',
  ERROR_ASSIGNED = 'error_assigned',
  ERROR_COMMENT = 'error_comment',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => ErrorGroup, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'error_group_id' })
  errorGroup?: ErrorGroup;

  @Column({ name: 'error_group_id', nullable: true })
  errorGroupId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actor_id' })
  actor?: User; // The user who performed the action (e.g., admin who changed status)

  @Column({ name: 'actor_id', nullable: true })
  actorId?: string;
}

