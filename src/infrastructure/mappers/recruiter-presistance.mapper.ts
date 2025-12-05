import { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { RecruiterType } from "../db/mongodb/models/company.schema";
import { IRecruiterPresitanceMapper } from "@/application/interface/mappers/recruiter/presistance.mapper";

export class RecruiterPresitanceMapper
	implements IRecruiterPresitanceMapper<RecruiterEntity, RecruiterType> {
	toMongo(recruiter: RecruiterEntity): RecruiterType {
		return {
			_id: recruiter.id as string,
			email: recruiter.email,
			password: recruiter.password,
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
			profile_url: recruiter.profile_url,
			subscription: recruiter.subscription,
		};
	}

	async fromMongo(doc: RecruiterType): Promise<RecruiterEntity> {
		return RecruiterEntity.create({
			id: doc._id.toString(),
			email: doc.email,
			password: doc.password,
			name: doc.name,
			phone: doc.phone,
			GSTIN: doc.GSTIN ?? "",
			status: doc.status ?? "pending",
			website_link: doc.website_link ?? "",
			description: doc.description ?? "",
			category: doc.category ?? "",
			company_role: doc.company_role ?? "HR",
			is_verified_company: doc.is_verified_company ?? false,
			admin_approved: doc.admin_approved ?? false,
			subscription: doc.subscription ?? {
				current_plan: "free",
				is_subscribed: false,
			},
		});
	}
}
