import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ErrorsModule } from './errors/errors.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { User } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { ErrorGroup } from './errors/entities/error-group.entity';
import { ErrorOccurrence } from './errors/entities/error-occurrence.entity';
import { ErrorComment } from './errors/entities/error-comment.entity';
import { Notification } from './notifications/entities/notification.entity';

@Module({
  imports: [
    // Config module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'admin'),
        password: configService.get('DATABASE_PASSWORD', 'admin123'),
        database: configService.get('DATABASE_NAME', 'error_management'),
        entities: [User, Project, ErrorGroup, ErrorOccurrence, ErrorComment, Notification],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    ErrorsModule,
    DashboardModule,
    ChatModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

