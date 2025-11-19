import { QUEUE_TOKENS } from "@/application/enums/tokens";
import { Provider } from "@nestjs/common";
import { Queue } from "bullmq";
import { EmailQueueService } from "../services/implements/email-queue.service";

export const EmailQueueProvider: Provider[] = [
	{
		provide: "EMAIL_QUEUE_BULL",
		useFactory: () => {
			return new Queue("emailQueue", {
				connection: {
					host: "127.0.0.1",
					port: 6379,
				},
			});
		},
	},
	{
		provide: QUEUE_TOKENS.EMAIL_QUEUE,
		useClass: EmailQueueService,
	},
];
