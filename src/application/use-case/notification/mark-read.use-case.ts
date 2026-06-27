import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { NOTIFICATION_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { INotificationRepository } from "@/application/interface/repository/notification-repository.interface";

@Injectable()
export class MarkReadUseCase implements IExecutable<string, void> {
	constructor(
		@Inject(NOTIFICATION_TOKEN.NOTIFICATION_REPOSITORY)
		private readonly notificationRepository: INotificationRepository,
	) {}

	async execute(notificationId: string): Promise<void> {
		const notification = await this.notificationRepository.findById(notificationId);
		if (!notification) {
			throw new NotFoundException("Notification not found");
		}
		notification.markAsRead();
		await this.notificationRepository.save(notification);
	}
}
