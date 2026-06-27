import { Inject, Injectable, Logger } from "@nestjs/common";
import type { IFormRepository } from "@/application/interface/repository/form-repository.interface";
import { FormConfigEntity } from "@/domain/entity/form-config.entity";
import { DEFAULT_FORMS } from "@/domain/constants/default-forms";

@Injectable()
export class SeedDefaultFormsUseCase {
	private readonly _logger = new Logger(SeedDefaultFormsUseCase.name);

	constructor(
		@Inject("FORM_REPOSITORY")
		private readonly _formRepository: IFormRepository,
	) {}

	async execute(): Promise<void> {
		for (const definition of DEFAULT_FORMS) {
			const existing = await this._formRepository.findByKey(definition.formKey);
			if (existing) continue;
			await this._formRepository.save(FormConfigEntity.create(definition));
			this._logger.log(`Seeded default form config: ${definition.formKey}`);
		}
	}
}
