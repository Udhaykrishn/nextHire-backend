import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IPlanRepository } from "@/application/interface/repository/plan-repository.interface";
import type { UpdatePlanDto } from "@/application/dto/plan/update-plan.dto";
import type { PlanEntity } from "@/domain/entity/plan.entity";

@Injectable()
export class UpdatePlanUseCase implements IExecutable<{ id: string; data: UpdatePlanDto }, PlanEntity> {
	constructor(
		@Inject("PLAN_REPOSITORY")
		private readonly _planRepository: IPlanRepository,
	) {}

	async execute({ id, data }: { id: string; data: UpdatePlanDto }): Promise<PlanEntity> {
		const plan = await this._planRepository.findById(id);
		if (!plan) {
			throw new NotFoundException("Plan not found");
		}

		plan.update(data);
		const updated = await this._planRepository.findByIdAndUpdate(id, plan);
		if (!updated) {
			throw new NotFoundException("Plan not found during update");
		}
		return updated;
	}
}
