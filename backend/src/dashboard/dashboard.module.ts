import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ErrorsModule } from '../errors/errors.module';

@Module({
  imports: [ErrorsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}

