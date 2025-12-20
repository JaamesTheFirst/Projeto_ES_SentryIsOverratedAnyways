import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { ErrorGroup } from '../errors/entities/error-group.entity';
import { ErrorStatus } from '../errors/entities/error-group.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    message: string,
    errorGroupId?: string,
    actorId?: string,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      type,
      message,
      userId,
      errorGroupId,
      actorId,
      read: false,
    });

    return await this.notificationsRepository.save(notification);
  }

  async notifyErrorStatusChange(
    errorGroup: ErrorGroup,
    newStatus: ErrorStatus,
    actorId: string,
    actorName: string,
  ): Promise<void> {
    // Notify the user who reported the error, or the project owner if no reporter
    const targetUserId = errorGroup.reportedById || errorGroup.project?.ownerId;

    if (!targetUserId || targetUserId === actorId) {
      // Don't notify if no target user or if user is changing their own error
      return;
    }

    const statusMessages = {
      [ErrorStatus.RESOLVED]: 'resolved',
      [ErrorStatus.UNRESOLVED]: 'reopened',
      [ErrorStatus.IGNORED]: 'ignored',
      [ErrorStatus.DELETED]: 'deleted',
    };

    const message = `Admin ${actorName} ${statusMessages[newStatus]} your error: "${errorGroup.normalizedMessage}"`;

    await this.createNotification(
      targetUserId,
      NotificationType.ERROR_STATUS_CHANGED,
      message,
      errorGroup.id,
      actorId,
    );
  }

  async getUserNotifications(userId: string, unreadOnly: boolean = false) {
    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.errorGroup', 'errorGroup')
      .leftJoinAndSelect('notification.actor', 'actor')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (unreadOnly) {
      queryBuilder.andWhere('notification.read = :read', { read: false });
    }

    return await queryBuilder.getMany();
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { id: notificationId, userId },
      { read: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, read: false },
      { read: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationsRepository.count({
      where: { userId, read: false },
    });
  }
}

