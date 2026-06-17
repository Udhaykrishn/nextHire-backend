import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IPlanRepository } from "@/application/interface/repository/plan-repository.interface";
import type { PlanEntity } from "@/domain/entity/plan.entity";

@Injectable()
export class GetPlanByIdUseCase implements IExecutable<string, PlanEntity> {
	constructor(
		@Inject("PLAN_REPOSITORY")
		private readonly _planRepository: IPlanRepository,
	) {}

	async execute(id: string): Promise<PlanEntity> {
		const plan = await this._planRepository.findById(id);
		if (!plan) {
			throw new NotFoundException("Plan not found");
		}
		return plan;
	}
}
