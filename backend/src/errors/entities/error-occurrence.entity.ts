import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ErrorGroup } from './error-group.entity';

@Entity('error_occurrences')
export class ErrorOccurrence extends BaseEntity {
  @Column({ type: 'text' })
  fullMessage: string; // Original message with variable values

  @Column({ type: 'text' })
  stackTrace: string; // Full stack trace

  @Column({ type: 'json', nullable: true })
  metadata: {
    // Additional context
    url?: string;
    userAgent?: string;
    environment?: string;
    framework?: string;
    browser?: string;
    os?: string;
    screen?: string;
    userId?: string;
    userName?: string;
    [key: string]: any;
  };

  @ManyToOne(() => ErrorGroup, (errorGroup) => errorGroup.occurrences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'error_group_id' })
  errorGroup: ErrorGroup;

  @Column({ name: 'error_group_id' })
  errorGroupId: string;
}

