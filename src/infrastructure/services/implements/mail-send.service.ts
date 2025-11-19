// import type { IMailSender } from "../interface";
// import nodemailer, { type Transporter } from "nodemailer";
// import fs from "node:fs/promises";
// import path from "node:path";
// import mjml2html from "mjml";
// import handlebars from "handlebars";

// export class MailSender implements IMailSender {
// 	private transporter: Transporter;

// 	constructor(
// 		private readonly config: {
// 			service: string;
// 			user: string;
// 			pass: string;
// 			fromName?: string;
// 			templateDir?: string;
// 		} = {
// 			service: "gmail",
// 			user: "krishnauday320@gmail.com",
// 			pass: "wzyd voti fuox gvmk",
// 			fromName: "NextHire",
// 			templateDir: path.join(__dirname, "..", "templates"),
// 		},
// 	) {
// 		if (!this.config.user || !this.config.pass) {
// 			throw new Error(
// 				"MAIL_USER and MAIL_PASS environment variables are required",
// 			);
// 		}

// 		this.transporter = nodemailer.createTransport({
// 			service: this.config.service,
// 			auth: {
// 				user: this.config.user,
// 				pass: this.config.pass,
// 			},
// 		});

// 		this.transporter.verify((error) => {
// 			if (error) {
// 				console.error("Transporter verification failed:", error);
// 			} else {
// 				console.log("Transporter ready for sending emails");
// 			}
// 		});
// 	}

// 	private async renderTemplate(
// 		templateName: string,
// 		context: Record<string, unknown>,
// 	): Promise<string> {
// 		const templatePath = path.join(
// 			this.config.templateDir as string,
// 			`${templateName}.mjml`,
// 		);

// 		try {
// 			const mjmlTemplate = await fs.readFile(templatePath, "utf8");

// 			const compile = handlebars.compile(mjmlTemplate);
// 			const mjmlWithData = compile(context);

// 			const { html, errors } = mjml2html(mjmlWithData);

// 			if (errors.length > 0) {
// 				console.error(`MJML Template Errors for "${templateName}":`, errors);
// 				throw new Error(`MJML rendering failed for template: ${templateName}`);
// 			}

// 			return html;
// 		} catch (error) {
// 			throw new Error(
// 				`Template "${templateName}" rendering failed: ${(error as Error).message}`,
// 			);
// 		}
// 	}

// 	async sendMail(options: {
// 		to: string;
// 		subject: string;
// 		text?: string;
// 		html?: string;
// 		template?: string;
// 		context?: Record<string, unknown>;
// 	}): Promise<void> {
// 		const { to, subject, text, html, template, context } = options;

// 		if (!to || !subject) {
// 			throw new Error("Email 'to' and 'subject' are required");
// 		}

// 		let finalHTML = "";
// 		if (template && context) {
// 			finalHTML = await this.renderTemplate(template, context);
// 		} else if (html) {
// 			finalHTML = html;
// 		} else {
// 			throw new Error(
// 				"Either 'html' or 'template' with 'context' must be provided",
// 			);
// 		}

// 		const mailOptions = {
// 			from: `"${this.config.fromName}" <${this.config.user}>`,
// 			to,
// 			subject,
// 			html: finalHTML,
// 			text: text || "This email requires HTML support to view correctly.",
// 		};

// 		try {
// 			const info = await this.transporter.sendMail(mailOptions);
// 			console.log(`Email sent successfully: ${info.messageId} (to: ${to})`);
// 		} catch (error) {
// 			console.error("Failed to send email:", error);
// 			throw new Error(`Email sending failed: ${(error as Error).message}`);
// 		}
// 	}

// 	async sendOtp(to: string, otp: string, userName?: string): Promise<void> {
// 		await this.sendMail({
// 			to,
// 			subject: "Your One-Time Password (OTP) for NextHire",
// 			template: "welcome",
// 			context: {
// 				otp,
// 				userName: userName || "User",
// 				expiresIn: "5 minutes",
// 				appName: "NextHire",
// 			},
// 		});
// 	}
// }

import nodemailer from "nodemailer";

export class MailSender {
	private transporter;

	constructor(
		private readonly config = {
			service: "gmail",
			user: "krishnauday320@gmail.com",
			pass: "wzyd voti fuox gvmk",
			fromName: "MyApp",
		},
	) {
		this.transporter = nodemailer.createTransport({
			service: this.config.service,
			auth: {
				user: this.config.user,
				pass: this.config.pass,
			},
		});
	}

	async sendMail(to: string, subject: string, html: string) {
		await this.transporter.sendMail({
			from: `"${this.config.fromName}" <${this.config.user}>`,
			to,
			subject,
			html,
		});
	}

	async sendOtp(to: string, otp: string) {
		const html = `
      <h1>Your OTP Code</h1>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This code expires in 5 minutes.</p>
    `;

		await this.sendMail(to, "Your OTP Code", html);
	}
}
