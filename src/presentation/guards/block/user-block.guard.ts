import { USERS_TOKEN } from "@/application/enums/tokens";
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
export class UserBlockedGuard implements CanActivate {
	constructor(
		@Inject(USERS_TOKEN.CHECK_USER_BLOCKED_USE_CASE)
		private readonly checkUserBlocked: IExecutable<string, void>,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

		const payload = req.user;

		if (payload?.role !== ROLES.USER || !payload?.id) return true;

		try {
			await this.checkUserBlocked.execute(payload.id);
			return true;

		} catch (error) {

			throw new ForbiddenException(error.message);
		}
	}
}
