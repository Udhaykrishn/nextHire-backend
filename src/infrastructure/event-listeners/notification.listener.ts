import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { AUTH_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class NotificationListener {
	private readonly logger = new Logger(NotificationListener.name);
	private readonly JOB_NAME = "dispatch-notification";

	constructor(@InjectQueue("notification-queue") private readonly queue: Queue) {}

	@OnEvent(AUTH_EVENTS.OTP_GENERATED)
	async handleOtpGenerated(payload: { email: string; otp: string; name: string }) {
		this.logger.log(`Handling OTP event for ${payload.email}`);
		await this.queue.add(this.JOB_NAME, {
			recipientId: payload.email,
			recipientEmail: payload.email,
			type: "otp",
			data: {
				name: payload.name,
				otp: payload.otp,
			},
		});
	}

	@OnEvent(AUTH_EVENTS.FORGOT_PASSWORD)
	async handleForgotPassword(payload: { email: string; link: string; name: string }) {
		this.logger.log(`Handling Forgot Password event for ${payload.email}`);
		await this.queue.add(this.JOB_NAME, {
			recipientId: payload.email,
			recipientEmail: payload.email,
			type: "forgot_password",
			data: {
				name: payload.name,
				link: payload.link,
			},
		});
	}

	@OnEvent(AUTH_EVENTS.USER_SIGNUP)
	async handleUserSignup(payload: { email: string; name: string }) {
		this.logger.log(`Handling User Signup (Welcome) event for ${payload.email}`);
		await this.queue.add(this.JOB_NAME, {
			recipientId: payload.email,
			recipientEmail: payload.email,
			type: "welcome",
			data: {
				name: payload.name,
			},
		});
	}

	@OnEvent(AUTH_EVENTS.RECRUITER_SIGNUP)
	async handleRecruiterSignup(payload: { email: string; name: string }) {
		this.logger.log(`Handling Recruiter Signup (Welcome) event for ${payload.email}`);
		await this.queue.add(this.JOB_NAME, {
			recipientId: payload.email,
			recipientEmail: payload.email,
			type: "welcome",
			data: {
				name: payload.name,
			},
		});
	}
}
