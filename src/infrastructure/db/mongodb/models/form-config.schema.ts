import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ _id: false })
export class FormFieldDocument {
	@Prop({ required: true })
	key: string;

	@Prop({ required: true })
	label: string;

	@Prop({
		required: true,
		enum: ["text", "email", "tel", "url", "password", "textarea", "select", "number", "date"],
	})
	type: string;

	@Prop()
	placeholder?: string;

	@Prop({ required: true, default: false })
	required: boolean;

	@Prop({ required: true, default: true })
	enabled: boolean;

	@Prop({ required: true, default: false })
	locked: boolean;

	@Prop({ required: true, default: false })
	custom: boolean;

	@Prop({ required: true, default: 0 })
	order: number;

	@Prop({
		type: [{ label: { type: String }, value: { type: String } }],
		default: undefined,
	})
	options?: { label: string; value: string }[];

	@Prop()
	minLength?: number;

	@Prop()
	pattern?: string;

	@Prop()
	errorMessage?: string;
}

export const FormFieldSchema = SchemaFactory.createForClass(FormFieldDocument);

@Schema({ timestamps: true })
export class FormConfigDocument extends Document {
	@Prop({ required: true, unique: true, index: true })
	formKey: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true, enum: ["candidate", "recruiter", "auth"] })
	audience: string;

	@Prop({ type: [FormFieldSchema], default: [] })
	fields: FormFieldDocument[];
}

export const FormConfigSchema = SchemaFactory.createForClass(FormConfigDocument);
