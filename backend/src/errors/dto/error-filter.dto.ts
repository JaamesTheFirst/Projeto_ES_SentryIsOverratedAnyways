import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ErrorSeverity, ErrorStatus } from '../entities/error-group.entity';

export class ErrorFilterDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsEnum(ErrorSeverity)
  severity?: ErrorSeverity;

  @IsOptional()
  @IsEnum(ErrorStatus)
  status?: ErrorStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  dateRange?: string; // '24h', '7d', '30d', 'all'

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

