import { Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		const request = context.switchToHttp().getRequest();
		const token = request.cookies?.accessToken;

		if (!token) {
			if (isPublic) {
				return true;
			}
			throw new UnauthorizedException("Token missing");
		}

		try {
			const payload = this.jwtService.verify(token);
			request.user = payload;
			return true;
		} catch {
			if (isPublic) {
				return true;
			}
			throw new UnauthorizedException("Invalid token");
		}
	}
}
