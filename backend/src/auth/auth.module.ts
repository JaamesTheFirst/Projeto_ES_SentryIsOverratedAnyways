import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    forwardRef(() => ProjectsModule),
  ],
  providers: [JwtStrategy, ApiKeyGuard],
  exports: [JwtModule, PassportModule, ApiKeyGuard],
})
export class AuthModule {}

