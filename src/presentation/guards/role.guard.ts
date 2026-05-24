import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) return true;

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user) {
			throw new ForbiddenException("User not found");
		}

		if (!requiredRoles.includes(user.role)) {
			throw new ForbiddenException("Not allowed");
		}

		return true;
	}
}
