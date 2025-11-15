export interface IEmailService {
	validate(email: string): Promise<boolean>;
}
