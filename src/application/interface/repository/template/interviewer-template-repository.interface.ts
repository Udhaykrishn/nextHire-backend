import type { IBaseRepository } from "./base-repository.interface";
import type { InterviewerTemplateEntity } from "@/domain/entity/template/interviewer-template.entity";

export interface IInterviewerTemplateRepository extends IBaseRepository<InterviewerTemplateEntity> {
	findByCompanyId(companyId: string): Promise<InterviewerTemplateEntity[]>;
}
