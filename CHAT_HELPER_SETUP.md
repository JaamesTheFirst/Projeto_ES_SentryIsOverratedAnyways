# 💬 Chat Helper Setup Guide

## Overview

The Chat Helper is an app-context-aware LLM-powered assistant that helps users navigate and understand the Error Tracker app.

## Features

- ✅ **Free** - Uses Groq API (free tier) or Hugging Face (free)
- ✅ **Context-Aware** - Knows current page, user's projects, available features
- ✅ **Helpful** - Answers questions about the app, navigation, features
- ✅ **Beautiful UI** - Floating chat button with modern design

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install `@nestjs/axios` and `axios` for making HTTP requests to LLM APIs.

### 2. Configure LLM API (Optional)

The chat helper works with **two free options**:

#### Option A: Groq API (Recommended - Fast & Free)
1. Sign up at https://console.groq.com (free, no credit card)
2. Get your API key
3. Add to `backend/.env`:
   ```env
   LLM_API_KEY=your_groq_api_key_here
   LLM_API_URL=https://api.groq.com/openai/v1/chat/completions
   ```

#### Option B: Hugging Face (Free, No API Key Needed)
- Works out of the box without configuration
- Uses free inference API
- May be slower than Groq

#### Option C: No API Key (Fallback Mode)
- If no API key is configured, uses intelligent keyword-based responses
- Still helpful for common questions
- Completely free, no setup needed

### 3. Start the Backend

```bash
cd backend
npm run start:dev
```

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

### 5. Test the Chat Helper

1. Log in to the app
2. Look for the floating chat button (💬) in the bottom-right corner
3. Click it to open the chat
4. Try asking:
   - "How do I create a project?"
   - "What is the dashboard for?"
   - "How do I view errors?"
   - "Tell me about SDKs"

## How It Works

1. **Frontend**: ChatHelper component sends user message + app context
2. **Backend**: ChatService receives request, builds context-aware prompt
3. **LLM API**: Groq/Hugging Face processes request with app knowledge
4. **Response**: Returns helpful, context-aware answer

## Context Information

The chat helper knows:
- Current page/route
- User's projects (names and IDs)
- Available features
- App structure and navigation
- Error tracking concepts

## Customization

### Change the System Prompt

Edit `backend/src/chat/chat.service.ts` → `buildSystemPrompt()` method to customize how the assistant behaves.

### Change the Model

Edit `backend/src/chat/chat.service.ts` → `callGroqAPI()` method:
- `llama-3.1-8b-instant` - Fast, free
- `llama-3.1-70b-versatile` - More capable (still free)
- `mixtral-8x7b-32768` - Alternative model

### Add More Context

In `frontend/src/components/Layout.tsx`, you can pass more context to ChatHelper:
```tsx
<ChatHelper
  currentPage={location.pathname}
  userProjects={userProjects}
  availableFeatures={[...]}
  // Add more context here
/>
```

## Troubleshooting

### Chat not responding?
- Check backend logs for errors
- Verify LLM_API_KEY is set (if using Groq)
- Check network tab for API errors

### Slow responses?
- Groq is usually fast (< 1 second)
- Hugging Face can be slower (2-5 seconds)
- Fallback mode is instant

### Want to use a different LLM?
- Edit `chat.service.ts` to add support for:
  - OpenAI (requires API key, not free)
  - Anthropic Claude (requires API key, not free)
  - Local LLM via Ollama (completely free, runs locally)

## Cost

- **Groq**: Free tier (generous limits)
- **Hugging Face**: Free tier (some rate limits)
- **Fallback**: Completely free, no API calls

Perfect for university projects! 🎓

