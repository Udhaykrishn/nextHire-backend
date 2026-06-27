import { Injectable, Inject } from "@nestjs/common";
import { NOTIFICATION_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { INotificationRepository } from "@/application/interface/repository/notification-repository.interface";

@Injectable()
export class UnreadCountUseCase implements IExecutable<string, number> {
	constructor(
		@Inject(NOTIFICATION_TOKEN.NOTIFICATION_REPOSITORY)
		private readonly notificationRepository: INotificationRepository,
	) {}

	async execute(recipientId: string): Promise<number> {
		return this.notificationRepository.getUnreadCount(recipientId);
	}
}
