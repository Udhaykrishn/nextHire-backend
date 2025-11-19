import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
	type CanActivate,
	type ExecutionContext,
} from "@nestjs/common";

@Injectable()
export class RefreshGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const token = request.cookies?.session_id;
		const accessToken = request.cookies?.accessToken;

		if (accessToken) {
			throw new BadRequestException("can't execute token already exisits");
		}

		if (!token) {
			throw new UnauthorizedException("Token missing");
		}

		try {
			request.sessionId = token;
			return true;
		} catch {
			throw new UnauthorizedException("Invalid token");
		}
	}
}
