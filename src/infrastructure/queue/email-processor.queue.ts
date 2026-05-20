import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { MailService } from "../services/implements";

interface EmailJobData {
	recipientEmail: string;
	type: "otp" | "forgot_password";
	data: {
		name: string;
		otp?: string;
		link?: string;
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
}
