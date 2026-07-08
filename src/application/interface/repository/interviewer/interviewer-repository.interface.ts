import type { IBaseRepository } from "./base-repository.interface";
import type { InterviewerEntity } from "@/domain/entity/interviewer/interviewer.entity";

export interface IInterviewerRepository extends IBaseRepository<InterviewerEntity> {
	findByEmail(email: string): Promise<InterviewerEntity | null>;
	findByCompanyId(companyId: string): Promise<InterviewerEntity[]>;
}
