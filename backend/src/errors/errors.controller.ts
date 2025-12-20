import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { ErrorsService } from './errors.service';
import { ReportErrorDto } from './dto/report-error.dto';
import { CreateErrorDto } from './dto/create-error.dto';
import { UpdateErrorDto } from './dto/update-error.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ErrorFilterDto } from './dto/error-filter.dto';

@Controller('errors')
export class ErrorsController {
  constructor(private readonly errorsService: ErrorsService) {}

  // SDK endpoint - uses API key authentication
  @Post('report')
  @UseGuards(ApiKeyGuard)
  async reportError(@Request() req, @Body() reportErrorDto: ReportErrorDto) {
    return await this.errorsService.reportError(req.project.id, reportErrorDto);
  }

  // Manual error creation - uses JWT authentication
  @Post()
  @UseGuards(JwtAuthGuard)
  async createError(@Request() req, @Body() createErrorDto: CreateErrorDto) {
    return await this.errorsService.createError(createErrorDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query() filters: ErrorFilterDto) {
    return await this.errorsService.findAll(filters, req.user.userId);
  }

  // Admin-only endpoints - must come before :id routes to avoid route conflicts
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllForAdmin(@Request() req, @Query() filters: ErrorFilterDto) {
    return await this.errorsService.findAllForAdmin(filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('id') id: string) {
    return await this.errorsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateErrorDto: UpdateErrorDto,
  ) {
    console.log(`[PATCH /errors/${id}] Updating error with status:`, updateErrorDto.status);
    const result = await this.errorsService.update(id, updateErrorDto, req.user.userId, req.user.role, req.user.userId);
    console.log(`[PATCH /errors/${id}] Update successful`);
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    console.log(`[DELETE /errors/${id}] Deleting error`);
    await this.errorsService.remove(id, req.user.userId, req.user.role);
    console.log(`[DELETE /errors/${id}] Delete successful`);
    return { message: 'Error deleted successfully' };
  }

  // Comment endpoints
  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Request() req,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.errorsService.addComment(id, req.user.userId, createCommentDto);
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  async getComments(@Request() req, @Param('id') id: string) {
    return await this.errorsService.getComments(id, req.user.role);
  }
}

