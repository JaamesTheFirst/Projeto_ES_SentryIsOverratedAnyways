import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

interface ChatRequest {
  message: string;
  context: {
    currentPage: string;
    userProjects: Array<{ id: string; name: string }>;
    availableFeatures: string[];
    timestamp: string;
  };
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('help')
  @UseGuards(JwtAuthGuard)
  async getHelp(@Request() req, @Body() chatRequest: ChatRequest) {
    const response = await this.chatService.getHelp(
      chatRequest.message,
      chatRequest.context,
    );

    return {
      response,
      timestamp: new Date().toISOString(),
    };
  }
}

