import type { Request } from "express";
import type { USER_ROLE } from "@/domain/enums";

export interface AuthPayload {
	id: string;
	email: string;
	role: USER_ROLE;
}

export interface AuthenticatedRequest extends Request {
	user: AuthPayload;
}
