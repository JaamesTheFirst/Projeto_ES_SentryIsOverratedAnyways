import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as crypto from 'crypto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  // Generate a secure API key for SDK authentication
  private generateApiKey(): string {
    return 'err_' + crypto.randomBytes(32).toString('hex');
  }

  async create(createProjectDto: CreateProjectDto, ownerId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId,
      apiKey: this.generateApiKey(),
    });

    return await this.projectsRepository.save(project);
  }

  async findAll(ownerId?: string): Promise<Project[]> {
    const queryBuilder = this.projectsRepository.createQueryBuilder('project');

    if (ownerId) {
      queryBuilder.where('project.ownerId = :ownerId', { ownerId });
    }

    queryBuilder.leftJoinAndSelect('project.owner', 'owner');

    return await queryBuilder.getMany();
  }

  async findOne(id: string, ownerId?: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (ownerId && project.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async findByApiKey(apiKey: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { apiKey },
    });

    if (!project) {
      throw new NotFoundException('Invalid API key');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, ownerId: string): Promise<Project> {
    const project = await this.findOne(id, ownerId);

    Object.assign(project, updateProjectDto);
    return await this.projectsRepository.save(project);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const project = await this.findOne(id, ownerId);
    await this.projectsRepository.remove(project);
  }

  async getStats(id: string, ownerId?: string) {
    const project = await this.findOne(id, ownerId);

    // Get error statistics for this project
    // This will be enhanced when we implement the errors module
    return {
      totalErrors: 0,
      unresolved: 0,
      resolved: 0,
      lastError: null,
    };
  }
}

