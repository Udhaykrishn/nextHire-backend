export interface ICompanyVerificationService {
	verifyGSTIN(gstin: string): Promise<boolean>;
	verifyCIN(cin: string): Promise<boolean>;
}
