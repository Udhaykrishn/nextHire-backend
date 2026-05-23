import { RecruiterEntity, RoleEntity } from "@/domain/entity";
import { RecruiterType } from "../db/mongodb/models/company.schema";
import { IRecruiterPresitanceMapper } from "@/application/interface/mappers/recruiter/presistance.mapper";

export class RecruiterPresitanceMapper implements IRecruiterPresitanceMapper<RecruiterEntity, RecruiterType> {
	toMongo(recruiter: RecruiterEntity): RecruiterType {
		return {
			_id: recruiter.id as string,
			email: recruiter.email,
			password: recruiter.password,
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
			profile_url: recruiter.profile_url,
			subscription: recruiter.subscription,
			job_count: recruiter.job_count,
			role: recruiter.role?.id as unknown as RecruiterType["role"],
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
			CIN: doc.CIN ?? "",
			status: doc.status ?? "pending",
			website_link: doc.website_link ?? "",
			description: doc.description ?? "",
			category: doc.category ?? "",
			company_role: doc.company_role ?? "HR",
			is_verified_company: doc.is_verified_company ?? false,
			verification_revoked_reason: doc.verification_revoked_reason ?? "",
			admin_approved: doc.admin_approved ?? false,
			profile_url: doc.profile_url ?? { key: "", url: "" },
			subscription: doc.subscription ?? {
				current_plan: "free",
				is_subscribed: false,
			},
			job_count: doc.job_count ?? 0,
			role:
				doc.role && typeof doc.role === "object" && "name" in doc.role
					? RoleEntity.create({
							id: (doc.role as { _id?: string })._id?.toString(),
							name: doc.role.name as string,
							permissions: (doc.role.permissions as { name: string }[])?.map((p) => ({
								name: p.name,
							})),
						})
					: undefined,
		});
	}
}
