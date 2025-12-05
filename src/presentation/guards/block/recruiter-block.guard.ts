import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IExecutable } from "@/application/interface/executable.interface";
import { ROLES } from "@/presentation/enums";
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
} from "@nestjs/common";

@Injectable()
export class RecruiterBlockedGuard implements CanActivate {
	constructor(
		@Inject(RECRUITER_TOKEN.CHECK_RECRUITER_BLOCKED_USE_CASE)
		private readonly checkRecruiterBlocked: IExecutable<string, void>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const payload = req.user;

		if (payload?.role !== ROLES.RECRUITER || !payload?.id) return true;

		try {
			await this.checkRecruiterBlocked.execute(payload.id);
			return true;
		} catch (error) {
			throw new ForbiddenException(error.message);
		}
	}
}
