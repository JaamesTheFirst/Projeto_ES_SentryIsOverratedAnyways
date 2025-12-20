import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorsService } from './errors.service';
import { ErrorsController } from './errors.controller';
import { ErrorGroup } from './entities/error-group.entity';
import { ErrorOccurrence } from './entities/error-occurrence.entity';
import { ErrorComment } from './entities/error-comment.entity';
import { ProjectsModule } from '../projects/projects.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ErrorGroup, ErrorOccurrence, ErrorComment]),
    forwardRef(() => ProjectsModule),
    forwardRef(() => UsersModule),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [ErrorsController],
  providers: [ErrorsService],
  exports: [ErrorsService],
})
export class ErrorsModule {}

