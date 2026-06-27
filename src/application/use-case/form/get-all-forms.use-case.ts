import { Inject, Injectable } from "@nestjs/common";
import type { IFormRepository } from "@/application/interface/repository/form-repository.interface";
import type { FormConfigEntity } from "@/domain/entity/form-config.entity";

@Injectable()
export class GetAllFormsUseCase {
	constructor(
		@Inject("FORM_REPOSITORY")
		private readonly _formRepository: IFormRepository,
	) {}

	async execute(): Promise<FormConfigEntity[]> {
		return await this._formRepository.findAll();
	}
}
