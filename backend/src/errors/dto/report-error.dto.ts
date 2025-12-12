import { IsString, IsOptional, IsEnum, IsObject, IsNumber } from 'class-validator';
import { ErrorSeverity } from '../entities/error-group.entity';

export class ReportErrorDto {
  @IsString()
  errorType: string; // TypeError, ReferenceError, etc.

  @IsString()
  message: string; // Original error message

  @IsString()
  stackTrace: string; // Full stack trace

  @IsOptional()
  @IsEnum(ErrorSeverity)
  severity?: ErrorSeverity;

  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsNumber()
  line?: number;

  @IsOptional()
  @IsString()
  functionName?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
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
}

