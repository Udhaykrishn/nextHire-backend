import { Injectable, Logger, Inject } from "@nestjs/common";
import { OnEvent, EventEmitter2 } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { AUTH_EVENTS, JOB_EVENTS, ADMIN_EVENTS } from "@/domain/enums/events.enum";
import { NOTIFICATION_TOKEN, ADMIN_AUTH_TOKEN } from "@/application/enums/tokens";
import type { INotificationRepository } from "@/application/interface/repository/notification-repository.interface";
import type { IAdminRepository } from "@/application/interface/repository";
import type { AdminEntity } from "@/domain/entity";
import { NotificationEntity } from "@/domain/entity/notification.entity";

@Injectable()
export class NotificationListener {
	private readonly logger = new Logger(NotificationListener.name);
	private readonly JOB_NAME = "dispatch-notification";

	constructor(
		@InjectQueue("notification-queue") private readonly queue: Queue,
		@Inject(NOTIFICATION_TOKEN.NOTIFICATION_REPOSITORY)
		private readonly notificationRepository: INotificationRepository,
		@Inject(ADMIN_AUTH_TOKEN.ADMIN_REPOSITORY)
		private readonly adminRepository: IAdminRepository<AdminEntity>,
		private readonly eventEmitter: EventEmitter2,
	) {
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
	async handleJobCreated(payload: {
		email: string;
		name: string;
		jobTitle: string;
		companyName: string;
		recruiterId?: string;
	}) {
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

		// 1. Create in-app notification for the Recruiter
		if (payload.recruiterId) {
			const recruiterNotif = NotificationEntity.create({
				recipient_id: payload.recruiterId,
				title: "Job Posted successfully! 🚀",
				message: `Your job post for "${payload.jobTitle}" is now live.`,
				type: "info",
			});
			const savedRecruiterNotif = await this.notificationRepository.save(recruiterNotif);
			this.eventEmitter.emit("notification.dispatched", savedRecruiterNotif);
		}

		// 2. Create in-app notification for all Admins
		try {
			const admins = await this.adminRepository.findAll();
			for (const admin of admins) {
				if (admin.id) {
					const adminNotif = NotificationEntity.create({
						recipient_id: admin.id,
						title: "New Job Posted",
						message: `A new job "${payload.jobTitle}" has been posted by recruiter ${payload.companyName}.`,
						type: "info",
					});
					const savedAdminNotif = await this.notificationRepository.save(adminNotif);
					this.eventEmitter.emit("notification.dispatched", savedAdminNotif);
				}
			}
		} catch (error) {
			this.logger.error("Failed to notify admins about job creation", error);
		}
	}

	@OnEvent(JOB_EVENTS.JOB_APPLIED)
	async handleJobApplied(payload: {
		candidateEmail: string;
		candidateName: string;
		recruiterEmail: string;
		recruiterName: string;
		jobTitle: string;
		companyName: string;
		candidateId?: string;
		recruiterId?: string;
		jobId?: string;
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

		// 3. Create in-app notification for the Recruiter
		if (payload.recruiterId) {
			const recruiterNotif = NotificationEntity.create({
				recipient_id: payload.recruiterId,
				title: "New Application Received 📄",
				message: `${payload.candidateName} has applied for "${payload.jobTitle}".`,
				type: "info",
				metadata: {
					jobId: payload.jobId,
				},
			});
			const saved = await this.notificationRepository.save(recruiterNotif);
			this.eventEmitter.emit("notification.dispatched", saved);
		}

		// 4. Create in-app notification for the Candidate
		if (payload.candidateId) {
			const candidateNotif = NotificationEntity.create({
				recipient_id: payload.candidateId,
				title: "Application Submitted Successfully",
				message: `You have successfully applied for "${payload.jobTitle}" at ${payload.companyName}.`,
				type: "info",
				metadata: {
					jobId: payload.jobId,
				},
			});
			const saved = await this.notificationRepository.save(candidateNotif);
			this.eventEmitter.emit("notification.dispatched", saved);
		}
	}

	@OnEvent(JOB_EVENTS.APPLICATION_STATUS_UPDATED)
	async handleApplicationStatusUpdated(payload: {
		candidateId: string;
		jobId: string;
		candidateEmail: string;
		candidateName: string;
		jobTitle: string;
		companyName: string;
		status: string;
	}) {
		this.logger.log(
			`Handling application status updated event for candidate ${payload.candidateId} (${payload.status})`,
		);

		let title = "";
		let message = "";
		let type = "info";

		if (payload.status === "SHORTLISTED") {
			title = "Application Shortlisted! 🎉";
			message = `Congratulations! Your application for "${payload.jobTitle}" at ${payload.companyName} has been shortlisted. You can now chat with the recruiter.`;
			type = "shortlist";
		} else if (payload.status === "REJECTED") {
			title = "Application Update";
			message = `Thank you for applying to "${payload.jobTitle}" at ${payload.companyName}. Unfortunately, they have decided not to move forward with your application.`;
			type = "reject";
		} else if (payload.status === "HIRED") {
			title = "Application Status: Hired! 🥳";
			message = `Congratulations! You have been hired for "${payload.jobTitle}" at ${payload.companyName}!`;
			type = "hired";
		} else {
			return; // Only notify for major transitions
		}

		// Create in-app notification
		const notification = NotificationEntity.create({
			recipient_id: payload.candidateId,
			title,
			message,
			type,
			metadata: {
				jobId: payload.jobId,
			},
		});

		const saved = await this.notificationRepository.save(notification);

		// Emit global event for WS gateway
		this.eventEmitter.emit("notification.dispatched", saved);
	}

	@OnEvent(ADMIN_EVENTS.USER_BLOCKED_UNBLOCKED)
	async handleUserBlockedUnblocked(payload: { userId: string; status: string; name: string; description: string }) {
		this.logger.log(`Handling User Blocked/Unblocked event for user ${payload.userId}`);
		const isBlocked = payload.status === "block";

		const title = isBlocked ? "Account Blocked ⚠️" : "Account Restored ✅";
		const message = isBlocked
			? `Your account has been blocked by the admin. Reason: ${payload.description || "No reason provided."}`
			: "Your account has been restored. You can now access all features.";
		const type = isBlocked ? "reject" : "info";

		const notification = NotificationEntity.create({
			recipient_id: payload.userId,
			title,
			message,
			type,
		});

		const saved = await this.notificationRepository.save(notification);
		this.eventEmitter.emit("notification.dispatched", saved);
	}

	@OnEvent(ADMIN_EVENTS.RECRUITER_BLOCKED_UNBLOCKED)
	async handleRecruiterBlockedUnblocked(payload: { recruiterId: string; status: string; companyName: string }) {
		this.logger.log(`Handling Recruiter Blocked/Unblocked event for recruiter ${payload.recruiterId}`);
		const isBlocked = payload.status === "blocked";

		const title = isBlocked ? "Recruiter Account Blocked ⚠️" : "Recruiter Account Restored ✅";
		const message = isBlocked
			? `Your company recruiter account has been blocked by the admin. Please contact support.`
			: "Your company recruiter account has been unblocked by the admin.";
		const type = isBlocked ? "reject" : "info";

		const notification = NotificationEntity.create({
			recipient_id: payload.recruiterId,
			title,
			message,
			type,
		});

		const saved = await this.notificationRepository.save(notification);
		this.eventEmitter.emit("notification.dispatched", saved);
	}

	@OnEvent(ADMIN_EVENTS.JOB_BLOCKED_UNBLOCKED)
	async handleJobBlockedUnblocked(payload: { jobId: string; status: string; jobTitle: string; recruiterId: string }) {
		this.logger.log(`Handling Job Blocked/Unblocked event for job ${payload.jobId}`);
		const isBlocked = payload.status === "BLOCKED";

		const title = isBlocked ? "Job Post Blocked ⚠️" : "Job Post Restored ✅";
		const message = isBlocked
			? `Your job post for "${payload.jobTitle}" has been blocked by the admin.`
			: `Your job post for "${payload.jobTitle}" has been unblocked and is now open.`;
		const type = isBlocked ? "reject" : "info";

		const notification = NotificationEntity.create({
			recipient_id: payload.recruiterId,
			title,
			message,
			type,
			metadata: {
				jobId: payload.jobId,
			},
		});

		const saved = await this.notificationRepository.save(notification);
		this.eventEmitter.emit("notification.dispatched", saved);
	}
}
