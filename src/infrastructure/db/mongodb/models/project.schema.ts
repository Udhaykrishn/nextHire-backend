import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	projectName: string;

	@Prop()
	description: string;

	@Prop()
	startDate: Date;

	@Prop()
	endDate: Date;

	@Prop()
	url: string;

	@Prop({
		type: [
			{
				name: { type: String },
				url: { type: String },
			},
		],
		default: [],
		_id: false,
	})
	githubUrls: { name: string; url: string }[];

	@Prop({ default: false })
	isCollaborative: boolean;

	@Prop({ type: [String], default: [] })
	skillsLearned: string[];

	@Prop({ default: "" })
	company: string;

	@Prop({ default: "" })
	location: string;

	@Prop({ default: "" })
	industry: string;

	@Prop({ default: "" })
	role: string;

	@Prop({ default: false })
	currentlyWorking: boolean;

	@Prop({ default: "" })
	employmentType: string;

	@Prop({ default: "" })
	noticePeriod: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

export type ProjectType = InferSchemaType<typeof ProjectSchema> & {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
};
