import { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { IRecruiterApplicationMappers } from "../interface/mappers/recruiter/application.mapper";
import { ResponseRecruiterDto } from "../dto/recruiter";
import { RecruiterType } from "@/infrastructure/db/mongodb/models";
import { RECRUITER_ROLE, RECRUITER_STATUS } from "@/domain/enums/status";

export class RecruiterApplicationMapper implements IRecruiterApplicationMappers<RecruiterType> {
	toResponse(recruiter: RecruiterEntity): ResponseRecruiterDto {
		return {
			id: recruiter.id as string,
			email: recruiter.email,
			name: recruiter.name,
			phone: recruiter.phone,

			GSTIN: recruiter.GSTIN,
			status: recruiter.status,
			website_link: recruiter.website_link,
			description: recruiter.description,
			category: recruiter.category,
			company_role: recruiter.company_role,
			is_verified_company: recruiter.is_verified_company,
			admin_approved: recruiter.admin_approved,
			subscription: recruiter.subscription,

			createdAt: recruiter.createdAt,
			updatedAt: recruiter.updatedAt || null,
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
			status: data.status ?? RECRUITER_STATUS.PENDING,
			website_link: data.website_link ?? "",
			description: data.description ?? "",
			category: data.category ?? "",
			company_role: data.company_role ?? RECRUITER_ROLE.HR,
			is_verified_company: data.is_verified_company ?? false,
			admin_approved: data.admin_approved ?? false,
			subscription: data.subscription ?? {
				current_plan: "free",
				is_subscribed: false,
			},
		});
	}
}
