import { Request } from "express";
import { CreateRecruiterDto, ResponseRecruiterDto, UpdateRecruiterDto } from "@/application/dto/recruiter";
import { PaginationResponse } from "@/domain/types/paginations";
import { ChangePasswordDto } from "@/application/dto/users";

export interface IRecruiterController {
	create(dto: CreateRecruiterDto): Promise<ResponseRecruiterDto>;
	getAll(
		search?: string,
		page?: number,
		limit?: number,
		status?: string,
	): Promise<PaginationResponse<ResponseRecruiterDto>>;
	getProfile(req: Request): Promise<ResponseRecruiterDto>;
	getOne(recruiterId: string): Promise<ResponseRecruiterDto>;
	update(recruiterId: string, dto: UpdateRecruiterDto): Promise<ResponseRecruiterDto>;
	blockUnblock(recruiterId: string): Promise<ResponseRecruiterDto>;
	changePassword(recruiterId: string, dto: ChangePasswordDto): Promise<ResponseRecruiterDto>;
	uploadProfileImage(req: Request, file: Express.Multer.File): Promise<ResponseRecruiterDto>;
}
