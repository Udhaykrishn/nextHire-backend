import { Global, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationListener } from "@/infrastructure/event-listeners/notification.listener";
import { EmailQueueProcessor } from "@/infrastructure/queue";
import { MailService } from "@/infrastructure/services/implements";
import { Notification, NotificationSchema } from "@/infrastructure/db/mongodb/models";
import { NotificationRepository } from "@/infrastructure/db/mongodb/repository/notification.repository";
import { NOTIFICATION_TOKEN } from "@/application/enums/tokens";
import { GetNotificationsUseCase } from "@/application/use-case/notification/get-notifications.use-case";
import { MarkReadUseCase } from "@/application/use-case/notification/mark-read.use-case";
import { MarkAllReadUseCase } from "@/application/use-case/notification/mark-all-read.use-case";
import { UnreadCountUseCase } from "@/application/use-case/notification/unread-count.use-case";

import { NotificationController } from "@/presentation/controller/notification/notification.controller";
import { AdminLiteModule } from "../admin/admin-db.module";

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: "notification-queue",
		}),
		MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
		AdminLiteModule,
	],
	controllers: [NotificationController],
	providers: [
		NotificationListener,
		EmailQueueProcessor,
		MailService,
		{
			provide: NOTIFICATION_TOKEN.NOTIFICATION_REPOSITORY,
			useClass: NotificationRepository,
		},
		{
			provide: NOTIFICATION_TOKEN.GET_NOTIFICATIONS_USE_CASE,
			useClass: GetNotificationsUseCase,
		},
		{
			provide: NOTIFICATION_TOKEN.MARK_NOTIFICATION_READ_USE_CASE,
			useClass: MarkReadUseCase,
		},
		{
			provide: NOTIFICATION_TOKEN.MARK_ALL_NOTIFICATIONS_READ_USE_CASE,
			useClass: MarkAllReadUseCase,
		},
		{
			provide: NOTIFICATION_TOKEN.GET_UNREAD_COUNT_USE_CASE,
			useClass: UnreadCountUseCase,
		},
	],
	exports: [
		BullModule,
		MailService,
		MongooseModule,
		NOTIFICATION_TOKEN.NOTIFICATION_REPOSITORY,
		NOTIFICATION_TOKEN.GET_NOTIFICATIONS_USE_CASE,
		NOTIFICATION_TOKEN.MARK_NOTIFICATION_READ_USE_CASE,
		NOTIFICATION_TOKEN.MARK_ALL_NOTIFICATIONS_READ_USE_CASE,
		NOTIFICATION_TOKEN.GET_UNREAD_COUNT_USE_CASE,
	],
})
export class NotificationModule {}
