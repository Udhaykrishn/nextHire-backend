import { EmailQueueProvider } from "@/infrastructure/provider/email-queue.provider";
import { EmailQueueProcessor } from "@/infrastructure/queue";
import { Module } from "@nestjs/common";

@Module({
	providers: [...EmailQueueProvider, EmailQueueProcessor],
	exports: [...EmailQueueProvider],
})
export class EmailQueueModule {}
