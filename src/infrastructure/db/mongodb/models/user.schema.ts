import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, unique: true, index: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	phone: string;

	@Prop()
	experience: string;

	@Prop()
	role_of_title: string;

	@Prop()
	status: string;

	@Prop()
	resume_url: string;

	@Prop()
	bio: string;

	@Prop({ required: true, default: false })
	badge: boolean;

	@Prop()
	google_id: string;

	@Prop({
		type: {
			current_plan: { type: String, default: "free" },
			is_subscribed: { type: Boolean, default: false },
		},
	})
	subscription: {
		current_plan: string;
		is_subscribed: boolean;
	};

	@Prop({
		type: {
			linkedin: { type: String },
			portfolio: { type: String },
			github: { type: String },
		},
	})
	social_link: {
		linkedin: string;
		portfolio: string;
		github: string;
	};
}

export const UserSchema = SchemaFactory.createForClass(User);
