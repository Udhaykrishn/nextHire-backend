import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { MailService } from "../services/implements";

interface EmailJobData {
	recipientEmail: string;
	type: "otp" | "forgot_password" | "welcome" | "job_created" | "job_applied_candidate" | "job_applied_recruiter";
	data: {
		name: string;
		otp?: string;
		link?: string;
		jobTitle?: string;
		companyName?: string;
		candidateName?: string;
	};
}

interface EmailJobResult {
	sent: boolean;
	to: string;
}

@Processor("notification-queue")
export class EmailQueueProcessor extends WorkerHost {
	private readonly logger = new Logger(EmailQueueProcessor.name);

	constructor(private readonly mailService: MailService) {
		super();
	}

	async process(job: Job<EmailJobData, EmailJobResult, string>): Promise<EmailJobResult> {
		this.logger.log(`Processing job ${job.id} of type ${job.name}`);
		const { recipientEmail, type, data } = job.data;

		let subject = "";
		let html = "";

		if (type === "otp") {
			subject = "Verify Your Email - NextHire";
			html = this.getOtpTemplate(data.name, data.otp ?? "");
		} else if (type === "forgot_password") {
			subject = "Reset Your Password - NextHire";
			html = this.getForgotPasswordTemplate(data.name, data.link ?? "");
		} else if (type === "welcome") {
			subject = "Welcome to NextHire!";
			html = this.getWelcomeTemplate(data.name);
		} else if (type === "job_created") {
			subject = `Job Successfully Posted: ${data.jobTitle}`;
			html = this.getJobCreatedTemplate(data.name, data.jobTitle ?? "", data.companyName ?? "");
		} else if (type === "job_applied_candidate") {
			subject = `Application Received: ${data.jobTitle} at ${data.companyName}`;
			html = this.getJobAppliedCandidateTemplate(data.name, data.jobTitle ?? "", data.companyName ?? "");
		} else if (type === "job_applied_recruiter") {
			subject = `New Application for ${data.jobTitle}`;
			html = this.getJobAppliedRecruiterTemplate(data.name, data.candidateName ?? "", data.jobTitle ?? "", data.companyName ?? "");
		}

		if (subject && html) {
			try {
				await this.mailService.sendMail(recipientEmail, subject, html);
				this.logger.log(`Successfully sent ${type} email to ${recipientEmail}`);
			} catch (error) {
				this.logger.error(`Failed to send ${type} email to ${recipientEmail}`);
				throw error;
			}
		} else {
			this.logger.warn(`Unknown notification type: ${type}`);
		}

		return { sent: true, to: recipientEmail };
	}

	private getOtpTemplate(name: string, otp: string): string {
		return `
			<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #0F172A; margin: 0; font-size: 24px; font-weight: 700;">NextHire</h1>
					<p style="color: #64748B; font-size: 14px; margin-top: 4px;">Premium Recruitment Platform</p>
				</div>
				<div style="padding: 20px; background-color: #F8FAFC; border-radius: 8px;">
					<h2 style="color: #1E293B; margin-top: 0; font-size: 18px;">Hello ${name},</h2>
					<p style="color: #475569; line-height: 1.6;">Thank you for joining NextHire! To complete your registration, please use the following verification code:</p>
					<div style="text-align: center; margin: 30px 0;">
						<span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #3B82F6; background: #EFF6FF; padding: 12px 24px; border-radius: 8px; border: 2px dashed #3B82F6;">${otp}</span>
					</div>
					<p style="color: #64748B; font-size: 13px; text-align: center;">This code will expire in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
				</div>
				<div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 12px;">
					&copy; 2024 NextHire. All rights reserved.
				</div>
			</div>
		`;
	}

	private getForgotPasswordTemplate(name: string, link: string): string {
		return `
			<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #0F172A; margin: 0; font-size: 24px; font-weight: 700;">NextHire</h1>
					<p style="color: #64748B; font-size: 14px; margin-top: 4px;">Secure Password Recovery</p>
				</div>
				<div style="padding: 20px; background-color: #F8FAFC; border-radius: 8px;">
					<h2 style="color: #1E293B; margin-top: 0; font-size: 18px;">Hello ${name},</h2>
					<p style="color: #475569; line-height: 1.6;">We received a request to reset your password. Click the button below to proceed with the reset:</p>
					<div style="text-align: center; margin: 35px 0;">
						<a href="${link}" style="background-color: #3B82F6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);">Reset My Password</a>
					</div>
					<p style="color: #64748B; font-size: 13px; line-height: 1.5;">If the button above doesn't work, copy and paste this link into your browser:<br>
					<span style="word-break: break-all; color: #3B82F6;">${link}</span></p>
					<hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 25px 0;">
					<p style="color: #94A3B8; font-size: 12px; text-align: center;">If you didn't request a password reset, your account is still secure and you can ignore this email.</p>
				</div>
				<div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 12px;">
					&copy; 2024 NextHire. All rights reserved.
				</div>
			</div>
		`;
	}

	private getWelcomeTemplate(name: string): string {
		return `
			<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #0F172A; margin: 0; font-size: 24px; font-weight: 700;">NextHire</h1>
				</div>
				<div style="padding: 20px; background-color: #F8FAFC; border-radius: 8px;">
					<h2 style="color: #1E293B; margin-top: 0; font-size: 18px;">Welcome to NextHire, ${name}!</h2>
					<p style="color: #475569; line-height: 1.6;">We're excited to have you on board. NextHire is the premium platform to connect top talent with great opportunities.</p>
					<p style="color: #475569; line-height: 1.6;">Explore the platform to discover new possibilities!</p>
				</div>
			</div>
		`;
	}

	private getJobCreatedTemplate(name: string, jobTitle: string, companyName: string): string {
		return `
			<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #0F172A; margin: 0; font-size: 24px; font-weight: 700;">NextHire</h1>
					<p style="color: #64748B; font-size: 14px; margin-top: 4px;">Job Posting Confirmed</p>
				</div>
				<div style="padding: 20px; background-color: #F8FAFC; border-radius: 8px;">
					<h2 style="color: #1E293B; margin-top: 0; font-size: 18px;">Hello ${name},</h2>
					<p style="color: #475569; line-height: 1.6;">Your job posting for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> is now active!</p>
					<p style="color: #475569; line-height: 1.6;">Candidates can now discover and apply to your open position. We will notify you whenever you receive a new application.</p>
				</div>
				<div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 12px;">
					&copy; 2024 NextHire. All rights reserved.
				</div>
			</div>
		`;
	}

	private getJobAppliedCandidateTemplate(name: string, jobTitle: string, companyName: string): string {
		return `
			<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #0F172A; margin: 0; font-size: 24px; font-weight: 700;">NextHire</h1>
					<p style="color: #64748B; font-size: 14px; margin-top: 4px;">Application Successfully Submitted</p>
				</div>
				<div style="padding: 20px; background-color: #F8FAFC; border-radius: 8px;">
					<h2 style="color: #1E293B; margin-top: 0; font-size: 18px;">Hi ${name},</h2>
					<p style="color: #475569; line-height: 1.6;">We have successfully sent your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
					<p style="color: #475569; line-height: 1.6;">The recruiting team will review your profile shortly. You can track your application status directly from your dashboard.</p>
					<p style="color: #475569; line-height: 1.6;">Best of luck!</p>
				</div>
				<div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 12px;">
					&copy; 2024 NextHire. All rights reserved.
				</div>
			</div>
		`;
	}

	private getJobAppliedRecruiterTemplate(name: string, candidateName: string, jobTitle: string, companyName: string): string {
		return `
			<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff;">
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #0F172A; margin: 0; font-size: 24px; font-weight: 700;">NextHire</h1>
					<p style="color: #64748B; font-size: 14px; margin-top: 4px;">New Candidate Application</p>
				</div>
				<div style="padding: 20px; background-color: #F8FAFC; border-radius: 8px;">
					<h2 style="color: #1E293B; margin-top: 0; font-size: 18px;">Hello ${name},</h2>
					<p style="color: #475569; line-height: 1.6;">Good news! <strong>${candidateName}</strong> has just applied for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
					<p style="color: #475569; line-height: 1.6;">Log into your recruiter dashboard to review their resume and match score, and take the next step in the hiring process.</p>
				</div>
				<div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 12px;">
					&copy; 2024 NextHire. All rights reserved.
				</div>
			</div>
		`;
	}
}
