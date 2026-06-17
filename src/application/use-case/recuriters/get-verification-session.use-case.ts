import { Inject, Injectable } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { ISessionVerificationService } from "@/infrastructure/services/interface/session-verification-service.interface";

@Injectable()
export class GetVerificationSessionUseCase
	implements IExecutable<string, { step: string; cin: string; otp: string } | null>
{
	constructor(
		@Inject(COMMON_TOKEN.SESSION_VERIFICATION_SERVICE)
		private readonly _sessionVerificationService: ISessionVerificationService,
	) {}

	async execute(recruiterId: string): Promise<{ step: string; cin: string; otp: string } | null> {
		const session = await this._sessionVerificationService.getSession(recruiterId, "COMPANY_CIN");
		if (!session) return null;
		return {
			step: session.step as string,
			cin: session.cin as string,
			otp: session.otp as string,
		};
	}
}
