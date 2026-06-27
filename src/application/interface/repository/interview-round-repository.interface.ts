import type { IBaseRepository } from "./base-repository.interface";
import type { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";

export interface IInterviewRoundRepository extends IBaseRepository<InterviewRoundEntity> {
	findByApplicationId(applicationId: string): Promise<InterviewRoundEntity[]>;
	findByInterviewerId(interviewerId: string): Promise<InterviewRoundEntity[]>;
	findByMeetingCode(meetingCode: string): Promise<InterviewRoundEntity | null>;
	findByCandidateId(candidateId: string): Promise<InterviewRoundEntity[]>;
}
