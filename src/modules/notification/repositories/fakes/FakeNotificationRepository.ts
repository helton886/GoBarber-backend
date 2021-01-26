import { ObjectID } from 'mongodb';
import INotificationRepository from '@modules/notification/repositories/INotificationRepository';
import ICreateNotificationDTO from '@modules/notification/dtos/ICreateNotificationDTO';

import Notification from '../../infra/typeorm/schemas/Notification';

class NotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();
    Object.assign(notification, { id: new ObjectID(), content, recipient_id });
    this.notifications.push(notification);
    return notification;
  }
}

export default NotificationRepository;
