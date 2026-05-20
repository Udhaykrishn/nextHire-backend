import { AdminLoginDto } from "@/application/dto/auth/admin/admin-login.dto";
import { Request, Response } from "express";

export interface IAdminAuthController {
	login(dto: AdminLoginDto, res: Response): Promise<{ accessToken: string }>;
	refresh(req: Request, res: Response): Promise<{ success: boolean }>;
	logout(req: Request, res: Response): Promise<{ success: boolean }>;
}
