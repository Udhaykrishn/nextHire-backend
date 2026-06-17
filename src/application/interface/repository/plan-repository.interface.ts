import type { IBaseRepository } from "./base-repository.interface";
import type { PlanEntity } from "@/domain/entity/plan.entity";

export interface IPlanRepository extends IBaseRepository<PlanEntity> {
	findByType(type: "candidate" | "recruiter"): Promise<PlanEntity[]>;
}
