import { USER_STATUS } from "@/domain/enums/status/user-status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, unique: true, index: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	name: string;

	@Prop({ default: "" })
	phone: string;

	@Prop()
	experience: string;

	@Prop()
	role_of_title: string;

	@Prop({
		type: String,
		default: USER_STATUS.PENDING,
		enum: USER_STATUS,
	})
	status: string;

	@Prop({
		type: {
			key: { type: String },
			url: { type: String },
		},
		_id: false,
	})
	resume_url: {
		key: string;
		url: string;
	};

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
		_id: false,
	})
	subscription: {
		current_plan: string;
		is_subscribed: boolean;
	};

	@Prop({
		type: {
			key: { type: String },
			url: { type: String },
		},
		_id: false,
	})
	profile_url: {
		key: string;
		url: string;
	};

	@Prop({
		type: {
			linkedin: { type: String },
			portfolio: { type: String },
			github: { type: String },
		},
		_id: false,
	})
	social_link: {
		linkedin: string;
		portfolio: string;
		github: string;
	};
	@Prop({ type: [String], default: [] })
	skills: string[];

	@Prop({
		type: [
			{
				name: { type: String, required: true },
				proficiency: { type: String, required: true, enum: ["Low", "Medium", "High"] },
			},
		],
		default: [],
		_id: false,
	})
	languages: {
		name: string;
		proficiency: string;
	}[];

	@Prop({ type: String, default: "" })
	cinNumber: string;

	@Prop({ type: Boolean, default: false })
	isCompanyVerified: boolean;

	@Prop({ type: String, default: "" })
	block_description: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserType = InferSchemaType<typeof UserSchema> & {
	_id: string;
	createdAt: Date;
};
