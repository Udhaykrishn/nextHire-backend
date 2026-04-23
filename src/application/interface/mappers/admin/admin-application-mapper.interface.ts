import type { ResponseAdminDto } from "@/application/dto/admin/response-admin.dto";
import type { AdminEntity } from "@/domain/entity";
import { AdminType } from "@/infrastructure/db/mongodb/models";

export interface IAdminApplicationMapper {
	toResponse(admin: AdminEntity): ResponseAdminDto;
	toDomain(data: AdminType): AdminEntity;
}
