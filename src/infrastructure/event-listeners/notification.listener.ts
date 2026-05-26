import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { AUTH_EVENTS, JOB_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class NotificationListener {
	private readonly logger = new Logger(NotificationListener.name);
	private readonly JOB_NAME = "dispatch-notification";

	constructor(@InjectQueue("notification-queue") private readonly queue: Queue) {
		this.logger.log("NotificationListener initialized");
	}

	@OnEvent(AUTH_EVENTS.OTP_GENERATED)
	async handleOtpGenerated(payload: { email: string; otp: string; name: string }) {
		this.logger.log(`Handling OTP event for ${payload.email}`);
		console.log("OTP Event Received", payload);
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
		console.log("Forgot Password Event Received", payload);
		try {
			const job = await this.queue.add(this.JOB_NAME, {
				recipientId: payload.email,
				recipientEmail: payload.email,
				type: "forgot_password",
				data: {
					name: payload.name,
					link: payload.link,
				},
			});
			console.log("Job added to queue", job.id);
		} catch (error) {
			this.logger.error("Failed to add job to queue", error);
		}
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

	@OnEvent(JOB_EVENTS.JOB_CREATED)
	async handleJobCreated(payload: { email: string; name: string; jobTitle: string; companyName: string }) {
		this.logger.log(`Handling Job Created event for ${payload.email}`);
		await this.queue.add(this.JOB_NAME, {
			recipientId: payload.email,
			recipientEmail: payload.email,
			type: "job_created",
			data: {
				name: payload.name,
				jobTitle: payload.jobTitle,
				companyName: payload.companyName,
			},
		});
	}

	@OnEvent(JOB_EVENTS.JOB_APPLIED)
	async handleJobApplied(payload: {
		candidateEmail: string;
		candidateName: string;
		recruiterEmail: string;
		recruiterName: string;
		jobTitle: string;
		companyName: string;
	}) {
		this.logger.log(`Handling Job Applied event for ${payload.candidateEmail} and ${payload.recruiterEmail}`);

		// 1. Email to candidate
		await this.queue.add(this.JOB_NAME, {
			recipientId: payload.candidateEmail,
			recipientEmail: payload.candidateEmail,
			type: "job_applied_candidate",
			data: {
				name: payload.candidateName,
				jobTitle: payload.jobTitle,
				companyName: payload.companyName,
			},
		});

		// 2. Email to recruiter
		await this.queue.add(this.JOB_NAME, {
			recipientId: payload.recruiterEmail,
			recipientEmail: payload.recruiterEmail,
			type: "job_applied_recruiter",
			data: {
				name: payload.recruiterName,
				candidateName: payload.candidateName,
				jobTitle: payload.jobTitle,
				companyName: payload.companyName,
			},
		});
	}
}
