export interface IMailSender {
	sendMail(options: {
		to: string;
		subject: string;
		text?: string;
		html?: string;
		template?: string;
		context?: Record<string, unknown>;
	}): Promise<void>;
	sendOtp(to: string, otp: string, userName?: string): Promise<void>;
}
