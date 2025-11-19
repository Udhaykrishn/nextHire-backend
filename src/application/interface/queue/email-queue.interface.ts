export interface IEmailQueue {
	addSendOtpJob(email: string, otp: string, name: string): Promise<void>;
}
