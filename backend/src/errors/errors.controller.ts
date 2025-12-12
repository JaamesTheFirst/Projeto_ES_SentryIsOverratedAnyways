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
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { ErrorsService } from './errors.service';
import { ReportErrorDto } from './dto/report-error.dto';
import { CreateErrorDto } from './dto/create-error.dto';
import { UpdateErrorDto } from './dto/update-error.dto';
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
    return await this.errorsService.createError(createErrorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query() filters: ErrorFilterDto) {
    return await this.errorsService.findAll(filters, req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('id') id: string) {
    return await this.errorsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateErrorDto: UpdateErrorDto,
  ) {
    return await this.errorsService.update(id, updateErrorDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    // TODO: Implement soft delete or cascade delete
    return { message: 'Error deleted successfully' };
  }
}

