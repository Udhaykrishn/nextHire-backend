export interface ICompanyVerificationService {
	verifyGSTIN(gstin: string): Promise<boolean>;
}
