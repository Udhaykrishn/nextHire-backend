import { Global, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { NotificationListener } from "@/infrastructure/event-listeners/notification.listener";
import { EmailQueueProcessor } from "@/infrastructure/queue";
import { MailService } from "@/infrastructure/services/implements";

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: "notification-queue",
		}),
	],
	providers: [NotificationListener, EmailQueueProcessor, MailService],
	exports: [BullModule, MailService],
})
export class NotificationModule {}
