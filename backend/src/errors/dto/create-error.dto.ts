import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ErrorSeverity } from '../entities/error-group.entity';

export class CreateErrorDto {
  @IsString()
  title: string; // Error title/message

  @IsString()
  projectId: string;

  @IsString()
  stackTrace: string;

  @IsEnum(ErrorSeverity)
  severity: ErrorSeverity;

  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsString()
  line?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  environment?: string;
}

