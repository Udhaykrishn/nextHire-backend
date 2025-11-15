import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type JobsDocument = HydratedDocument<Jobs>;

@Schema({ timestamps: true })
export class Jobs {
	@Prop({ type: String, default: null })
	updated_at: string | null;

	@Prop({ type: String, default: null })
	job_logo: string | null;

	@Prop({ type: String, default: null })
	work_mode: string | null;

	@Prop({ type: String, default: null })
	job_description: string | null;

	@Prop({
		type: [
			{
				requirement: { type: String, default: null },
				title: { type: String, default: null },
			},
		],
		default: [],
	})
	job_requirements: { requirement: string | null; title: string | null }[];

	@Prop({ type: String, default: null })
	job_title: string | null;

	@Prop({ type: String, default: null })
	job_shift: string | null;

	@Prop({
		type: {
			additions: { type: String, default: null },
			document_carry: [{ type: String, default: null }],
			interview_date: { type: String, default: null },
			interview_location: { type: String, default: null },
			interview_mode: { type: String, default: null },
			is_active: { type: Boolean, default: null },
		},
	})
	walk_in_interview: {
		additions: string | null;
		document_carry: string[] | null;
		interview_date: string | null;
		interview_location: string | null;
		interview_mode: string | null;
		is_active: boolean | null;
	};

	@Prop({ type: String, default: null })
	company_id: string | null;

	@Prop({
		type: {
			max: { type: String, default: null },
			min: { type: String, default: null },
		},
	})
	salary: { max: string | null; min: string | null };

	@Prop({ type: [String], default: null })
	job_role_department: string[] | null;

	@Prop({
		type: [
			{
				fields: { type: String, default: null },
				title: { type: String, default: null },
			},
		],
		default: [],
	})
	requirement_ats: { fields: string | null; title: string | null }[];

	@Prop({ type: String, default: null })
	posted_by: string | null;

	@Prop({ type: String, default: null })
	job_highlights: string | null;

	@Prop({ type: String, default: null })
	created_at: string | null;

	@Prop({ type: String, default: null })
	status: string | null;

	@Prop({ type: Boolean, default: false })
	is_published: boolean;

	@Prop({ type: String, default: null })
	job_type: string | null;
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);
