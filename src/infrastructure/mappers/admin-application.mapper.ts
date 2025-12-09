import { ResponseAdminDto } from "@/application/dto/admin/response-admin.dto";
import type { IAdminApplicationMapper } from "@/application/interface/mappers/admin";
import { AdminEntity } from "@/domain/entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminApplicationMapper implements IAdminApplicationMapper {
    toResponse(admin: AdminEntity): ResponseAdminDto {
        return {
            id: admin.id as string,
            email: admin.email,
        };
    }

    toDomain(data: any): AdminEntity {
        return AdminEntity.create({
            id: data.id,
            email: data.email,
            password: data.password,
        });
    }
}
