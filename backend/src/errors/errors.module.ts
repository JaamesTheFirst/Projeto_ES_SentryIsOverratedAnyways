import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorsService } from './errors.service';
import { ErrorsController } from './errors.controller';
import { ErrorGroup } from './entities/error-group.entity';
import { ErrorOccurrence } from './entities/error-occurrence.entity';
import { ProjectsModule } from '../projects/projects.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ErrorGroup, ErrorOccurrence]),
    forwardRef(() => ProjectsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ErrorsController],
  providers: [ErrorsService],
  exports: [ErrorsService],
})
export class ErrorsModule {}

