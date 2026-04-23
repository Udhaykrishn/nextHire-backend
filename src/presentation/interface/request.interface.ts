import type { Request } from "express";
import type { USER_ROLE, PERMISSION } from "@/domain/enums";

export interface AuthenticatedRequest extends Request {
	user: {
		id: string;
		role: USER_ROLE | string;
		email: string;
		permissions: PERMISSION[] | string[];
	};
	sessionId: string;
}
