import { Controller, Get, Patch, Param, Req, UseGuards, Inject, HttpStatus, HttpCode } from "@nestjs/common";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import { NOTIFICATION_TOKEN } from "@/application/enums/tokens";
import { NOTIFICATION_ROUTERS } from "@/presentation/enums/notification-router.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { NotificationEntity } from "@/domain/entity/notification.entity";

@UseGuards(AuthGuard)
@Controller(NOTIFICATION_ROUTERS.ROUTER)
export class NotificationController {
	constructor(
		@Inject(NOTIFICATION_TOKEN.GET_NOTIFICATIONS_USE_CASE)
		private readonly _getNotificationsUseCase: IExecutable<string, NotificationEntity[]>,
		@Inject(NOTIFICATION_TOKEN.MARK_NOTIFICATION_READ_USE_CASE)
		private readonly _markReadUseCase: IExecutable<string, void>,
		@Inject(NOTIFICATION_TOKEN.MARK_ALL_NOTIFICATIONS_READ_USE_CASE)
		private readonly _markAllReadUseCase: IExecutable<string, void>,
		@Inject(NOTIFICATION_TOKEN.GET_UNREAD_COUNT_USE_CASE)
		private readonly _getUnreadCountUseCase: IExecutable<string, number>,
	) {}

	@Get(NOTIFICATION_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.OK)
	async getNotifications(@Req() req: AuthenticatedRequest) {
		const entities = await this._getNotificationsUseCase.execute(req.user.id);
		return entities.map((entity) => ({
			id: entity.id,
			recipient_id: entity.recipient_id,
			title: entity.title,
			message: entity.message,
			is_read: entity.is_read,
			type: entity.type,
			metadata: entity.metadata,
			createdAt: entity.createdAt,
		}));
	}

	@Get(NOTIFICATION_ROUTERS.UNREAD_COUNT)
	@HttpCode(HttpStatus.OK)
	async getUnreadCount(@Req() req: AuthenticatedRequest) {
		const count = await this._getUnreadCountUseCase.execute(req.user.id);
		return { count };
	}

	@Patch(NOTIFICATION_ROUTERS.MARK_ALL_READ)
	@HttpCode(HttpStatus.OK)
	async markAllRead(@Req() req: AuthenticatedRequest) {
		await this._markAllReadUseCase.execute(req.user.id);
		return { success: true };
	}

	@Patch(NOTIFICATION_ROUTERS.MARK_READ)
	@HttpCode(HttpStatus.OK)
	async markRead(@Param("id") id: string) {
		await this._markReadUseCase.execute(id);
		return { success: true };
	}
}
