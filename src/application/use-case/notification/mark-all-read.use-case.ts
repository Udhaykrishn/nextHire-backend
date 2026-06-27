import { Injectable, Inject } from "@nestjs/common";
import { NOTIFICATION_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { INotificationRepository } from "@/application/interface/repository/notification-repository.interface";

@Injectable()
export class MarkAllReadUseCase implements IExecutable<string, void> {
	constructor(
		@Inject(NOTIFICATION_TOKEN.NOTIFICATION_REPOSITORY)
		private readonly notificationRepository: INotificationRepository,
	) {}

	async execute(recipientId: string): Promise<void> {
		await this.notificationRepository.markAllAsRead(recipientId);
	}
}
