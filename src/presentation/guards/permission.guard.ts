import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { PERMISSION } from "@/domain/enums";

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const requiredPermissions = this.reflector.getAllAndOverride<PERMISSION[]>(PERMISSIONS_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredPermissions || requiredPermissions.length === 0) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();

		if (!user || !user.permissions) {
			throw new ForbiddenException("No permissions found for user");
		}

		const hasPermission = requiredPermissions.some((permission) => user.permissions.includes(permission));

		if (!hasPermission) {
			throw new ForbiddenException("You do not have the required permissions to access this resource");
		}

		return true;
	}
}
