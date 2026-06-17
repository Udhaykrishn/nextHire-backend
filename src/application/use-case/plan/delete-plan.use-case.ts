import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IPlanRepository } from "@/application/interface/repository/plan-repository.interface";

@Injectable()
export class DeletePlanUseCase implements IExecutable<string, void> {
	constructor(
		@Inject("PLAN_REPOSITORY")
		private readonly _planRepository: IPlanRepository,
	) {}

	async execute(id: string): Promise<void> {
		const plan = await this._planRepository.findById(id);
		if (!plan) {
			throw new NotFoundException("Plan not found");
		}
		await this._planRepository.deleteById(id);
	}
}
