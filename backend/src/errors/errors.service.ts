import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as crypto from 'crypto';
import { ErrorGroup, ErrorSeverity, ErrorStatus } from './entities/error-group.entity';
import { ErrorOccurrence } from './entities/error-occurrence.entity';
import { ReportErrorDto } from './dto/report-error.dto';
import { CreateErrorDto } from './dto/create-error.dto';
import { UpdateErrorDto } from './dto/update-error.dto';
import { ErrorFilterDto } from './dto/error-filter.dto';

@Injectable()
export class ErrorsService {
  constructor(
    @InjectRepository(ErrorGroup)
    private errorGroupsRepository: Repository<ErrorGroup>,
    @InjectRepository(ErrorOccurrence)
    private errorOccurrencesRepository: Repository<ErrorOccurrence>,
  ) {}

  // Normalize error message by removing variable values
  private normalizeMessage(message: string): string {
    return message
      .replace(/\b\d+\b/g, 'X') // Replace numbers
      .replace(/'[^']+'/g, "'X'") // Replace single-quoted strings
      .replace(/"[^"]+"/g, '"X"') // Replace double-quoted strings
      .replace(/`[^`]+`/g, '`X`') // Replace template literals
      .trim();
  }

  // Extract context from stack trace (file, line, function)
  private extractContext(stackTrace: string): { file: string; line: number; functionName: string } {
    const lines = stackTrace.split('\n');
    if (lines.length === 0) {
      return { file: '', line: 0, functionName: '' };
    }

    // Try to parse first stack trace line
    const firstLine = lines[0];
    
    // Pattern: at FunctionName (file.js:123:45) or at file.js:123:45
    const match = firstLine.match(/at\s+(\w+)?\s*\(?([^:]+):(\d+):(\d+)\)?/);
    
    if (match) {
      return {
        functionName: match[1] || '',
        file: match[2].split('/').pop() || match[2], // Get filename only
        line: parseInt(match[3], 10) || 0,
      };
    }

    // Fallback: try simpler pattern
    const simpleMatch = firstLine.match(/([^:]+):(\d+)/);
    if (simpleMatch) {
      return {
        file: simpleMatch[1].split('/').pop() || simpleMatch[1],
        line: parseInt(simpleMatch[2], 10) || 0,
        functionName: '',
      };
    }

    return { file: '', line: 0, functionName: '' };
  }

  // Create fingerprint for error grouping
  private createFingerprint(
    normalizedMessage: string,
    errorType: string,
    file: string,
    functionName: string,
  ): string {
    const fingerprintString = `${errorType}:${normalizedMessage}:${file}:${functionName}`;
    return crypto.createHash('sha256').update(fingerprintString).digest('hex');
  }

  // Report error from SDK
  async reportError(projectId: string, reportErrorDto: ReportErrorDto): Promise<ErrorGroup> {
    const normalizedMessage = this.normalizeMessage(reportErrorDto.message);
    const context = this.extractContext(reportErrorDto.stackTrace);
    
    const fingerprint = this.createFingerprint(
      normalizedMessage,
      reportErrorDto.errorType,
      context.file,
      context.functionName,
    );

    // Find or create error group
    let errorGroup = await this.errorGroupsRepository.findOne({
      where: { fingerprint, projectId },
    });

    const now = new Date();

    if (!errorGroup) {
      // Create new error group
      errorGroup = this.errorGroupsRepository.create({
        fingerprint,
        normalizedMessage,
        errorType: reportErrorDto.errorType,
        severity: reportErrorDto.severity || ErrorSeverity.ERROR,
        status: ErrorStatus.UNRESOLVED,
        occurrenceCount: 0,
        firstSeenAt: now,
        lastSeenAt: now,
        file: reportErrorDto.file || context.file,
        line: reportErrorDto.line || context.line,
        functionName: reportErrorDto.functionName || context.functionName,
        projectId,
      });
    } else {
      // Update existing error group
      errorGroup.occurrenceCount += 1;
      errorGroup.lastSeenAt = now;
      // Update severity if new one is more critical
      if (reportErrorDto.severity) {
        const severityOrder = {
          [ErrorSeverity.INFO]: 0,
          [ErrorSeverity.WARNING]: 1,
          [ErrorSeverity.ERROR]: 2,
          [ErrorSeverity.CRITICAL]: 3,
        };
        if (severityOrder[reportErrorDto.severity] > severityOrder[errorGroup.severity]) {
          errorGroup.severity = reportErrorDto.severity;
        }
      }
    }

    errorGroup = await this.errorGroupsRepository.save(errorGroup);

    // Create error occurrence
    const occurrence = this.errorOccurrencesRepository.create({
      fullMessage: reportErrorDto.message,
      stackTrace: reportErrorDto.stackTrace,
      metadata: reportErrorDto.metadata || {},
      errorGroupId: errorGroup.id,
    });

    await this.errorOccurrencesRepository.save(occurrence);

    return errorGroup;
  }

  // Create error manually (from Register Incident page)
  async createError(createErrorDto: CreateErrorDto): Promise<ErrorGroup> {
    const normalizedMessage = this.normalizeMessage(createErrorDto.title);
    const context = this.extractContext(createErrorDto.stackTrace);

    const fingerprint = this.createFingerprint(
      normalizedMessage,
      'Error', // Default type for manual reports
      createErrorDto.file || context.file,
      '',
    );

    let errorGroup = await this.errorGroupsRepository.findOne({
      where: { fingerprint, projectId: createErrorDto.projectId },
    });

    const now = new Date();

    if (!errorGroup) {
      errorGroup = this.errorGroupsRepository.create({
        fingerprint,
        normalizedMessage,
        errorType: 'Error',
        severity: createErrorDto.severity,
        status: ErrorStatus.UNRESOLVED,
        occurrenceCount: 0,
        firstSeenAt: now,
        lastSeenAt: now,
        file: createErrorDto.file || context.file,
        line: createErrorDto.line ? parseInt(createErrorDto.line, 10) : context.line,
        functionName: '',
        projectId: createErrorDto.projectId,
      });
    } else {
      errorGroup.occurrenceCount += 1;
      errorGroup.lastSeenAt = now;
    }

    errorGroup = await this.errorGroupsRepository.save(errorGroup);

    // Create occurrence
    const occurrence = this.errorOccurrencesRepository.create({
      fullMessage: createErrorDto.title,
      stackTrace: createErrorDto.stackTrace,
      metadata: {
        url: createErrorDto.url,
        userAgent: createErrorDto.userAgent,
        environment: createErrorDto.environment,
      },
      errorGroupId: errorGroup.id,
    });

    await this.errorOccurrencesRepository.save(occurrence);

    return errorGroup;
  }

  // Find all errors with filters
  async findAll(filters: ErrorFilterDto, ownerId?: string) {
    const queryBuilder = this.errorGroupsRepository
      .createQueryBuilder('errorGroup')
      .leftJoinAndSelect('errorGroup.project', 'project')
      .leftJoinAndSelect('errorGroup.assignedTo', 'assignedTo');

    // Apply filters
    if (filters.projectId) {
      queryBuilder.andWhere('errorGroup.projectId = :projectId', { projectId: filters.projectId });
    } else if (ownerId) {
      // If no project filter, only show projects owned by user
      queryBuilder.andWhere('project.ownerId = :ownerId', { ownerId });
    }

    if (filters.severity) {
      queryBuilder.andWhere('errorGroup.severity = :severity', { severity: filters.severity });
    }

    if (filters.status) {
      queryBuilder.andWhere('errorGroup.status = :status', { status: filters.status });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(errorGroup.normalizedMessage LIKE :search OR errorGroup.file LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const dateMap = {
        '24h': 1,
        '7d': 7,
        '30d': 30,
      };
      const days = dateMap[filters.dateRange];
      if (days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        queryBuilder.andWhere('errorGroup.lastSeenAt >= :date', { date });
      }
    }

    // Pagination
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '20', 10);
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Order by last seen (most recent first)
    queryBuilder.orderBy('errorGroup.lastSeenAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Find one error group
  async findOne(id: string, ownerId?: string): Promise<ErrorGroup> {
    const queryBuilder = this.errorGroupsRepository
      .createQueryBuilder('errorGroup')
      .leftJoinAndSelect('errorGroup.project', 'project')
      .leftJoinAndSelect('errorGroup.assignedTo', 'assignedTo')
      .leftJoinAndSelect('errorGroup.occurrences', 'occurrences')
      .where('errorGroup.id = :id', { id });

    if (ownerId) {
      queryBuilder.andWhere('project.ownerId = :ownerId', { ownerId });
    }

    const errorGroup = await queryBuilder.getOne();

    if (!errorGroup) {
      throw new NotFoundException('Error not found');
    }

    return errorGroup;
  }

  // Update error group
  async update(id: string, updateErrorDto: UpdateErrorDto, ownerId?: string): Promise<ErrorGroup> {
    const errorGroup = await this.findOne(id, ownerId);

    if (updateErrorDto.status !== undefined) {
      errorGroup.status = updateErrorDto.status;
    }

    if (updateErrorDto.assignedToId !== undefined) {
      errorGroup.assignedToId = updateErrorDto.assignedToId;
    }

    return await this.errorGroupsRepository.save(errorGroup);
  }

  // Get dashboard statistics
  async getDashboardStats(ownerId: string) {
    const queryBuilder = this.errorGroupsRepository
      .createQueryBuilder('errorGroup')
      .leftJoin('errorGroup.project', 'project')
      .where('project.ownerId = :ownerId', { ownerId });

    const total = await queryBuilder.getCount();

    const unresolved = await queryBuilder
      .andWhere('errorGroup.status = :status', { status: ErrorStatus.UNRESOLVED })
      .getCount();

    const resolved = await queryBuilder
      .where('project.ownerId = :ownerId', { ownerId })
      .andWhere('errorGroup.status = :status', { status: ErrorStatus.RESOLVED })
      .getCount();

    // Get recent errors (last 5)
    const recent = await this.errorGroupsRepository
      .createQueryBuilder('errorGroup')
      .leftJoin('errorGroup.project', 'project')
      .leftJoinAndSelect('errorGroup.project', 'projectData')
      .where('project.ownerId = :ownerId', { ownerId })
      .orderBy('errorGroup.lastSeenAt', 'DESC')
      .take(5)
      .getMany();

    return {
      totalErrors: total,
      unresolved,
      resolved,
      recentErrors: recent,
    };
  }
}

