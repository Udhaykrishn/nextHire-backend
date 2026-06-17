import { Inject, Injectable } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IPlanRepository } from "@/application/interface/repository/plan-repository.interface";
import type { CreatePlanDto } from "@/application/dto/plan/create-plan.dto";
import { PlanEntity } from "@/domain/entity/plan.entity";

@Injectable()
export class CreatePlanUseCase implements IExecutable<CreatePlanDto, PlanEntity> {
	constructor(
		@Inject("PLAN_REPOSITORY")
		private readonly _planRepository: IPlanRepository,
	) {}

	async execute(data: CreatePlanDto): Promise<PlanEntity> {
		const plan = PlanEntity.create({
			...data,
			subscribers: 0,
			status: data.status ?? "Draft",
		});
		return await this._planRepository.save(plan);
	}
}
