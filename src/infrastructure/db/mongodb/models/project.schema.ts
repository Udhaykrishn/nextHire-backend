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
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

export type ProjectType = InferSchemaType<typeof ProjectSchema> & {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
};
