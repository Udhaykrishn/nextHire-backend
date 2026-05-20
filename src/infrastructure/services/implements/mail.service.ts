import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { IMailService } from "../interface";

@Injectable()
export class MailService implements IMailService {
	private readonly logger = new Logger(MailService.name);
	private transporter: nodemailer.Transporter;

	constructor(private readonly configService: ConfigService) {
		const user = this.configService.get<string>("GMAIL_APP_ADDRESS");
		this.logger.log(`Initializing MailService for ${user}`);
		this.transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: this.configService.get<string>("GMAIL_APP_ADDRESS"),
				pass: this.configService.get<string>("GMAIL_APP_PASSWORD"),
			},
		});
	}

	async sendMail(to: string, subject: string, html: string): Promise<void> {
		try {
			console.log("mail service:", this.configService.get<string>("GMAIL_APP_ADDRESS"));
			console.log("mail password:", this.configService.get<string>("GMAIL_APP_PASSWORD"));
			this.logger.log(`Sending email to ${to} with subject: ${subject}`);
			await this.transporter.sendMail({
				from: `"NextHire" <${this.configService.get<string>("GMAIL_APP_ADDRESS")}>`,
				to,
				subject,
				html,
			});
			this.logger.log(`Email successfully sent to ${to}`);
		} catch (error) {
			this.logger.error(`Failed to send email to ${to}`);
			if (error instanceof Error) {
				this.logger.error(error.message);
			}
			throw error;
		}
	}
}
