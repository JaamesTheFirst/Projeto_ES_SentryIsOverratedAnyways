import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ErrorStatus } from '../entities/error-group.entity';

export class UpdateErrorDto {
  @IsOptional()
  @IsEnum(ErrorStatus)
  status?: ErrorStatus;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}

