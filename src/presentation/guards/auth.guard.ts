import {
	Injectable,
	UnauthorizedException,
	type CanActivate,
	type ExecutionContext,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const token = request.cookies?.accessToken;

		if (!token) {
			throw new UnauthorizedException("Token missing");
		}

		try {
			const payload = this.jwtService.verify(token);
			request.user = payload;
			return true;
		} catch {
			throw new UnauthorizedException("Invalid token");
		}
	}
}
