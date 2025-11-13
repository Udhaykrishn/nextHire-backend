import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type OfferLetterDocument = HydratedDocument<OfferLetter>;

@Schema({ timestamps: true })
export class OfferLetter {
	@Prop({ required: true })
	reason_reason: string;

	@Prop({ required: true })
	interview_id: string;

	@Prop({ required: true })
	company_id: string;

	@Prop({ required: true })
	status: string;

	@Prop({ required: true })
	application_id: string;

	@Prop({ required: true })
	user_id: string;
}

export const OfferLetterSchema = SchemaFactory.createForClass(OfferLetter);
