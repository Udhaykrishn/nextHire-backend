import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from "@nestjs/common";
import { GetAllPlansUseCase } from "@/application/use-case/plan/get-all-plans.use-case";
import { GetPlanByIdUseCase } from "@/application/use-case/plan/get-plan-by-id.use-case";
import { CreatePlanUseCase } from "@/application/use-case/plan/create-plan.use-case";
import { UpdatePlanUseCase } from "@/application/use-case/plan/update-plan.use-case";
import { DeletePlanUseCase } from "@/application/use-case/plan/delete-plan.use-case";
import { CreatePlanDto } from "@/application/dto/plan/create-plan.dto";
import { UpdatePlanDto } from "@/application/dto/plan/update-plan.dto";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { USER_ROLE } from "@/domain/enums";

@Controller("plans")
export class PlanController {
	constructor(
		private readonly _getAllPlansUseCase: GetAllPlansUseCase,
		private readonly _getPlanByIdUseCase: GetPlanByIdUseCase,
		private readonly _createPlanUseCase: CreatePlanUseCase,
		private readonly _updatePlanUseCase: UpdatePlanUseCase,
		private readonly _deletePlanUseCase: DeletePlanUseCase,
	) {}

	@Get()
	async getAllPlans() {
		return await this._getAllPlansUseCase.execute();
	}

	@Get(":id")
	async getPlanById(@Param("id") id: string) {
		return await this._getPlanByIdUseCase.execute(id);
	}

	@Post()
	@UseGuards(AuthGuard, RoleGuard)
	@Roles(USER_ROLE.ADMIN)
	async createPlan(@Body() dto: CreatePlanDto) {
		return await this._createPlanUseCase.execute(dto);
	}

	@Put(":id")
	@UseGuards(AuthGuard, RoleGuard)
	@Roles(USER_ROLE.ADMIN)
	async updatePlan(@Param("id") id: string, @Body() dto: UpdatePlanDto) {
		return await this._updatePlanUseCase.execute({ id, data: dto });
	}

	@Delete(":id")
	@UseGuards(AuthGuard, RoleGuard)
	@Roles(USER_ROLE.ADMIN)
	async deletePlan(@Param("id") id: string) {
		return await this._deletePlanUseCase.execute(id);
	}
}
