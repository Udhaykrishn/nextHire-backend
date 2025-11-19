import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import type { IMailSender } from "@/infrastructure/services/interface";
import { COMMON_TOKEN } from "@/application/enums/tokens";

@Processor("emailQueue")
export class EmailQueueProcessor extends WorkerHost {
	constructor(
		@Inject(COMMON_TOKEN.EMAIL_SERVICE)
		private readonly mailService: IMailSender,
	) {
		super();
	}

	async process(job: {
		data: { email: string; otp: string; name: string };
	}): Promise<void> {
		const { email, otp, name } = job.data;
		await this.mailService.sendOtp(email, otp, name);
	}
}
