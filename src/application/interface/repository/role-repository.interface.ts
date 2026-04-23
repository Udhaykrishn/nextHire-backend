import type { RoleEntity } from "@/domain/entity/role.entity";

export interface IRoleRepository {
	findByName(name: string): Promise<RoleEntity | null>;
	findById(id: string): Promise<RoleEntity | null>;
}
