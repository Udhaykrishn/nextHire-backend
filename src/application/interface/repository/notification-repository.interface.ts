import { NotificationEntity } from "@/domain/entity/notification.entity";

export interface INotificationRepository {
	save(notification: NotificationEntity): Promise<NotificationEntity>;
	findByRecipient(recipientId: string): Promise<NotificationEntity[]>;
	findById(id: string): Promise<NotificationEntity | null>;
	update(id: string, entity: NotificationEntity): Promise<void>;
	markAllAsRead(recipientId: string): Promise<void>;
	getUnreadCount(recipientId: string): Promise<number>;
}
