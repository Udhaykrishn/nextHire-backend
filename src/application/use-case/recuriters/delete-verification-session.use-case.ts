import { Inject, Injectable } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { ISessionVerificationService } from "@/infrastructure/services/interface";

@Injectable()
export class DeleteVerificationSessionUseCase implements IExecutable<string, { message: string }> {
	constructor(
		@Inject(COMMON_TOKEN.SESSION_VERIFICATION_SERVICE)
		private readonly _sessionVerificationService: ISessionVerificationService,
	) {}

	async execute(recruiterId: string): Promise<{ message: string }> {
		await this._sessionVerificationService.deleteSession(recruiterId, "COMPANY_CIN");
		return { message: "Verification session deleted successfully" };
	}
}
