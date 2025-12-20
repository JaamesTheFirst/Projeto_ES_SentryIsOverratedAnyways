import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Project } from '../../projects/entities/project.entity';
import { ErrorOccurrence } from './error-occurrence.entity';
import { ErrorComment } from './error-comment.entity';
import { User } from '../../users/entities/user.entity';

export enum ErrorSeverity {
  CRITICAL = 'critical',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

//need add Analyzing, In Resolution
export enum ErrorStatus {
  UNRESOLVED = 'unresolved',
  RESOLVED = 'resolved',
  IGNORED = 'ignored',
  DELETED = 'deleted',
}

@Entity('error_groups')
export class ErrorGroup extends BaseEntity {
  @Column({ unique: true })
  fingerprint: string; // Unique identifier for grouping similar errors

  @Column()
  normalizedMessage: string; // Cleaned message for grouping

  @Column()
  errorType: string; // TypeError, ReferenceError, etc.

  @Column({
    type: 'enum',
    enum: ErrorSeverity,
    default: ErrorSeverity.ERROR,
  })
  severity: ErrorSeverity;

  @Column({
    type: 'enum',
    enum: ErrorStatus,
    default: ErrorStatus.UNRESOLVED,
  })
  status: ErrorStatus;

  @Column()
  occurrenceCount: number; // Total number of times this error occurred

  @Column({ type: 'timestamp', name: 'first_seen_at' })
  firstSeenAt: Date;

  @Column({ type: 'timestamp', name: 'last_seen_at' })
  lastSeenAt: Date;

  @Column({ nullable: true })
  file: string; // File where error occurred

  @Column({ nullable: true })
  line: number; // Line number

  @Column({ nullable: true })
  functionName: string; // Function/method name

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id' })
  projectId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @Column({ name: 'assigned_to_id', nullable: true })
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reported_by_id' })
  reportedBy?: User; // User who manually reported the error (if any)

  @Column({ name: 'reported_by_id', nullable: true })
  reportedById?: string;

  @OneToMany(() => ErrorOccurrence, (occurrence) => occurrence.errorGroup)
  occurrences: ErrorOccurrence[];

  @OneToMany(() => ErrorComment, (comment) => comment.errorGroup)
  comments: ErrorComment[];
}

