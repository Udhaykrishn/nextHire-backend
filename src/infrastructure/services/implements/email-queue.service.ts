import { Inject, Injectable } from "@nestjs/common";
import { IEmailQueue } from "@/application/interface/queue";
import { Queue } from "bullmq";

@Injectable()
export class EmailQueueService implements IEmailQueue {
	constructor(
		@Inject("EMAIL_QUEUE_BULL")
		private readonly queue: Queue,
	) {}

	async addSendOtpJob(email: string, otp: string, name: string): Promise<void> {
		await this.queue.add("sendOtp", { email, otp, name });
	}
}
