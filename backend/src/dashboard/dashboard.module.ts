import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ErrorsModule } from '../errors/errors.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ErrorsModule,
    AuthModule,
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}

