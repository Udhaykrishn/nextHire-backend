import type { FormConfigEntity } from "@/domain/entity/form-config.entity";

export interface IFormRepository {
	findAll(): Promise<FormConfigEntity[]>;
	findByKey(formKey: string): Promise<FormConfigEntity | null>;
	save(entity: FormConfigEntity): Promise<FormConfigEntity>;
	updateByKey(formKey: string, entity: FormConfigEntity): Promise<FormConfigEntity | null>;
}
