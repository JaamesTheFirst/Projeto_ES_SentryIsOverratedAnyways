import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Error Management API - Sentry is Overrated Anyways 🚀';
  }
}

