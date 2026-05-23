import { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { IRecruiterApplicationMappers } from "../interface/mappers/recruiter/application.mapper";
import { ResponseRecruiterDto } from "../dto/recruiter";
import { RecruiterType } from "@/infrastructure/db/mongodb/models";
import { RECRUITER_ROLE, RECRUITER_STATUS } from "@/domain/enums/status";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RecruiterApplicationMapper implements IRecruiterApplicationMappers<RecruiterType> {
	toResponse(recruiter: RecruiterEntity): ResponseRecruiterDto {
		return {
			id: recruiter.id as string,
			email: recruiter.email,
			name: recruiter.name,
			phone: recruiter.phone,

			GSTIN: recruiter.GSTIN,
			CIN: recruiter.CIN,
			status: recruiter.status,
			website_link: recruiter.website_link,
			description: recruiter.description,
			category: recruiter.category,
			company_role: recruiter.company_role,
			is_verified_company: recruiter.is_verified_company,
			verification_revoked_reason: recruiter.verification_revoked_reason,
			admin_approved: recruiter.admin_approved,
			job_count: 0,
			subscription: recruiter.subscription,
			profile_url: recruiter.profile_url,

			createdAt: recruiter.createdAt,
			updatedAt: recruiter.updatedAt ?? undefined,
		};
	}

	toDomain(data: RecruiterType): RecruiterEntity {
		return RecruiterEntity.create({
			id: data._id?.toString(),
			email: data.email,
			password: data.password,
			name: data.name,
			phone: data.phone,
			GSTIN: data.GSTIN ?? "",
			CIN: data.CIN ?? "",
			status: data.status ?? RECRUITER_STATUS.PENDING,
			website_link: data.website_link ?? "",
			description: data.description ?? "",
			category: data.category ?? "",
			company_role: data.company_role ?? RECRUITER_ROLE.HR,
			is_verified_company: data.is_verified_company ?? false,
			admin_approved: data.admin_approved ?? false,
			verification_revoked_reason: data.verification_revoked_reason ?? "",
			profile_url: data.profile_url ?? { key: "", url: "" },
			subscription: data.subscription ?? {
				current_plan: "free",
				is_subscribed: false,
			},
		});
	}
}
