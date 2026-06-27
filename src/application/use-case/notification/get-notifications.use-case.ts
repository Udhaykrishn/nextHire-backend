import { Injectable, Inject } from "@nestjs/common";
import { NOTIFICATION_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { INotificationRepository } from "@/application/interface/repository/notification-repository.interface";
import { NotificationEntity } from "@/domain/entity/notification.entity";

@Injectable()
export class GetNotificationsUseCase implements IExecutable<string, NotificationEntity[]> {
	constructor(
		@Inject(NOTIFICATION_TOKEN.NOTIFICATION_REPOSITORY)
		private readonly notificationRepository: INotificationRepository,
	) {}

	async execute(recipientId: string): Promise<NotificationEntity[]> {
		return this.notificationRepository.findByRecipient(recipientId);
	}
}
