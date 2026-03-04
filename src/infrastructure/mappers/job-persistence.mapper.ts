import type { IJobPersistenceMapper } from "@/application/interface/mappers/job/job-persistence.mapper";
import { JobEntity } from "@/domain/entity/job.entity";
import type { JobType } from "../db/mongodb/models/job.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JobPersistenceMapper implements IJobPersistenceMapper<JobEntity, JobType> {
	toMongo(data: JobEntity): JobType {
		// We need to map Entity to Schema Type
		// Note: _id handling is often tricky. Mongoose handles it if we don't pass it,
		// or we pass it if updating.
		// Here we return object matching JobType.

		return {
			_id: data.id!, // Assumes id exists when mapping back to mongo for update, or ignored on create
			job_title: data.job_title,
			job_description: data.job_description,
			job_logo: data.job_logo,
			work_mode: data.work_mode,
			job_requirements: data.job_requirements.map((r) => ({ requirement: r.requirement, title: r.title })),
			job_shift: data.job_shift,
			walk_in_interview: {
				...data.walk_in_interview,
				document_carry: data.walk_in_interview.document_carry,
			},
			company_id: data.company_id,
			salary: data.salary,
			job_role_department: data.job_role_department,
			requirement_ats: data.requirement_ats.map((r) => ({ fields: r.fields, title: r.title })),
			posted_by: data.posted_by,
			job_highlights: data.job_highlights,
			created_at: data.created_at,
			updated_at: data.updated_at,
			status: data.status,
			is_published: data.is_published,
			job_type: data.job_type,
		} as unknown as JobType;
		// Cast to unknown then JobType because _id type mismatch (string vs ObjectId) often happens.
		// Ideally we handle this cleanly.
	}

	async fromMongo(data: JobType): Promise<JobEntity> {
		return JobEntity.create({
			id: data._id.toString(),
			job_title: data.job_title || "",
			job_description: data.job_description || "",
			job_logo: data.job_logo || "",
			work_mode: data.work_mode || "",
			job_requirements: (data.job_requirements || []).map((r) => ({
				requirement: r.requirement || "",
				title: r.title || "",
			})),
			job_shift: data.job_shift || "",
			walk_in_interview: data.walk_in_interview
				? {
						additions: data.walk_in_interview.additions || "",
						document_carry: data.walk_in_interview.document_carry || [],
						interview_date: data.walk_in_interview.interview_date || "",
						interview_location: data.walk_in_interview.interview_location || "",
						interview_mode: data.walk_in_interview.interview_mode || "",
						is_active: data.walk_in_interview.is_active || false,
					}
				: {
						additions: "",
						document_carry: [],
						interview_date: "",
						interview_location: "",
						interview_mode: "",
						is_active: false,
					},
			company_id: data.company_id || "",
			salary: data.salary ? { max: data.salary.max || "", min: data.salary.min || "" } : { max: "", min: "" },
			job_role_department: data.job_role_department || [],
			requirement_ats: (data.requirement_ats || []).map((r) => ({
				fields: r.fields || "",
				title: r.title || "",
			})),
			posted_by: data.posted_by || "",
			job_highlights: data.job_highlights || "",
			created_at: data.created_at || "",
			updated_at: data.updated_at || "",
			status: data.status || "",
			is_published: data.is_published,
			job_type: data.job_type || "",
		});
	}
}
