import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Permission } from "./permission.schema";

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
	@Prop({ required: true, unique: true })
	name: string;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }] })
	permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
