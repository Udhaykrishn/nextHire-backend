import type { ResponseAdminDto } from "@/application/dto/admin/response-admin.dto";
import type { AdminEntity } from "@/domain/entity";

export interface IAdminApplicationMapper {
    toResponse(admin: AdminEntity): ResponseAdminDto;
    toDomain(data: any): AdminEntity;
}
