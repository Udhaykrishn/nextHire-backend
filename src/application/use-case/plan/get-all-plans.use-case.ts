import { Inject, Injectable } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IPlanRepository } from "@/application/interface/repository/plan-repository.interface";
import type { PlanEntity } from "@/domain/entity/plan.entity";

@Injectable()
export class GetAllPlansUseCase implements IExecutable<void, PlanEntity[]> {
	constructor(
		@Inject("PLAN_REPOSITORY")
		private readonly _planRepository: IPlanRepository,
	) {}

	async execute(): Promise<PlanEntity[]> {
		return await this._planRepository.findAll();
	}
}
