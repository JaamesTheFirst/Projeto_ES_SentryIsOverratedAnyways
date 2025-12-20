import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

interface ChatContext {
  currentPage: string;
  userProjects: Array<{ id: string; name: string }>;
  availableFeatures: string[];
  timestamp: string;
}

@Injectable()
export class ChatService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Use Groq API (free tier, no credit card needed)
    // Alternative: Hugging Face Inference API
    // If no API key, will use fallback responses
    this.apiUrl = this.configService.get('LLM_API_URL', 'https://api.groq.com/openai/v1/chat/completions');
    this.apiKey = this.configService.get('LLM_API_KEY', '') || '';
  }

  async getHelp(message: string, context: ChatContext): Promise<string> {
    // Build system prompt with app context
    const systemPrompt = this.buildSystemPrompt(context);

    // Try Groq API first (free, fast) if API key is configured
    if (this.apiKey) {
      try {
        return await this.callGroqAPI(message, systemPrompt);
      } catch (error) {
        console.error('Groq API error, trying fallback:', error);
        // Continue to fallback
      }
    }

    // Try Hugging Face (free, no API key needed)
    try {
      return await this.callHuggingFaceAPI(message, systemPrompt);
    } catch (error) {
      console.error('Hugging Face API error, using keyword fallback:', error);
    }

    // Final fallback: keyword-based responses
    return this.getFallbackResponse(message, context);
  }

  private buildSystemPrompt(context: ChatContext): string {
    const projectsList = context.userProjects.length > 0
      ? context.userProjects.map(p => `- ${p.name} (ID: ${p.id})`).join('\n')
      : 'No projects yet';

    return `You are a helpful assistant for an Error Tracking and Management Platform (similar to Sentry).

APP CONTEXT:
- Current Page: ${context.currentPage}
- User's Projects: ${projectsList}
- Available Features: ${context.availableFeatures.join(', ')}

APP STRUCTURE:
The app has these main pages:
1. Dashboard - Overview of errors, statistics, and recent activity
2. Projects - Manage projects, view project details, create new projects
3. Errors - View all errors, filter by severity/status, search errors
4. Error Detail - Detailed view of a specific error with stack traces
5. Register Incident - Manually report/register new errors
6. Settings - User settings and preferences

FEATURES:
- Error tracking and monitoring
- Error grouping by fingerprint
- Error severity levels: critical, error, warning, info
- Error statuses: unresolved, resolved, ignored, deleted
- Project management with API keys for SDK integration
- Dashboard with statistics
- Error filtering and search

CAPABILITIES:
- Help users navigate the app
- Explain features and how to use them
- Answer questions about error tracking concepts
- Guide users on creating projects, viewing errors, etc.
- Provide tips and best practices

Be concise, helpful, and friendly. If the user asks about something not in the app, politely redirect to app-related topics.`;
  }

  private async callGroqAPI(message: string, systemPrompt: string): Promise<string> {
    try {
      const response: AxiosResponse<{
        choices: Array<{ message: { content: string } }>;
      }> = await firstValueFrom(
        this.httpService.post(
          this.apiUrl,
          {
            model: 'llama-3.1-8b-instant', // Free, fast model
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message },
            ],
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }

  private async callHuggingFaceAPI(message: string, systemPrompt: string): Promise<string> {
    try {
      // Using Hugging Face Inference API with a better model
      // Note: First request may be slow (model loading), subsequent requests are faster
      const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
      
      const response: AxiosResponse<
        | Array<{ generated_text: string }>
        | { generated_text: string }
      > = await firstValueFrom(
        this.httpService.post(
          'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
          {
            inputs: fullPrompt,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
          },
        ),
      );

      const generatedText = Array.isArray(response.data)
        ? response.data[0]?.generated_text
        : response.data?.generated_text;
      if (generatedText) {
        // Extract just the assistant's response (after "Assistant:")
        const assistantResponse = generatedText.split('Assistant:').pop()?.trim();
        return assistantResponse || this.getFallbackResponse(message, { currentPage: 'unknown', userProjects: [], availableFeatures: [], timestamp: new Date().toISOString() });
      }
      
      return this.getFallbackResponse(message, { currentPage: 'unknown', userProjects: [], availableFeatures: [], timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Hugging Face API error:', error);
      // Return fallback instead of throwing
      return this.getFallbackResponse(message, { currentPage: 'unknown', userProjects: [], availableFeatures: [], timestamp: new Date().toISOString() });
    }
  }

  private getFallbackResponse(message: string, context: ChatContext): string {
    const lowerMessage = message.toLowerCase();

    // Simple keyword-based responses as fallback
    if (lowerMessage.includes('project') || lowerMessage.includes('create')) {
      return `To create a project, go to the Projects page and click "Create Project". Each project gets a unique API key that you can use with our SDKs to track errors.`;
    }

    if (lowerMessage.includes('error') || lowerMessage.includes('view')) {
      return `You can view all errors on the Errors page. You can filter by severity (critical, error, warning, info) and status (unresolved, resolved, ignored). Click on any error to see detailed information including stack traces.`;
    }

    if (lowerMessage.includes('dashboard')) {
      return `The Dashboard shows an overview of your error tracking: total errors, unresolved count, resolved count, active projects, and recent errors. It's a great place to get a quick overview of your application's health.`;
    }

    if (lowerMessage.includes('sdk') || lowerMessage.includes('integrate')) {
      return `We have SDKs for JavaScript/TypeScript, React, Python, Android, and iOS. Each SDK automatically captures errors and sends them to your backend. Get your project's API key from the Projects page to start integrating.`;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return `I can help you navigate the app! Try asking about:
- Creating projects
- Viewing errors
- Using the dashboard
- Integrating SDKs
- Understanding error severity levels
What would you like to know more about?`;
    }

    return `I'm here to help you with the Error Tracker app! You can ask me about:
- Navigating different pages (Dashboard, Projects, Errors)
- Creating and managing projects
- Understanding and viewing errors
- Integrating our SDKs
- Using features like filtering and search

What would you like to know?`;
  }
}

