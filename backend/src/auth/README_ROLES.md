# Role-Based Authorization

This document explains how to use role-based authorization in the application.

## Overview

The application supports two user roles:
- `USER` - Regular user (default)
- `ADMIN` - Administrator

## Usage

### Protecting Endpoints with Roles

To protect an endpoint with role-based access, use the `@Roles()` decorator along with `@UseGuards()`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  // Only admins can access this endpoint
  @Get('users')
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    // Admin-only logic
  }

  // Both admins and users can access
  @Get('profile')
  async getProfile() {
    // No role restriction
  }
}
```

### Multiple Roles

You can allow multiple roles:

```typescript
@Get('moderator')
@Roles(UserRole.ADMIN, UserRole.USER)
async moderatorEndpoint() {
  // Accessible by both ADMIN and USER
}
```

### Accessing User Role in Controllers

The user's role is available in `request.user`:

```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req) {
  const userRole = req.user.role; // 'admin' or 'user'
  const userId = req.user.userId;
  // ...
}
```

## JWT Token

The JWT token now includes the user's role in the payload:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "user"
}
```

## Registration

By default, all new registrations are assigned the `USER` role. To create admin users:
1. Manually update the database
2. Create an admin endpoint (protected by admin role) to promote users
3. Use a special registration code/invite system

## Security Notes

- Always use `@UseGuards(JwtAuthGuard, RolesGuard)` together
- `JwtAuthGuard` must come before `RolesGuard` to ensure user is authenticated first
- The `RolesGuard` will throw `ForbiddenException` if user doesn't have required role

