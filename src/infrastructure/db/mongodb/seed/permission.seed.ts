import { Injectable, OnApplicationBootstrap, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Permission } from "../models/permission.schema";
import { Role } from "../models/role.schema";
import { User } from "../models/user.schema";
import { Recruiter } from "../models/company.schema";
import { Admin } from "../models/admin.schema";
import { PERMISSION, USER_ROLE, ROLE_PERMISSIONS } from "@/domain/enums";

@Injectable()
export class PermissionSeeder implements OnApplicationBootstrap {
	private readonly logger = new Logger(PermissionSeeder.name);

	constructor(
		@InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
		@InjectModel(Role.name) private readonly roleModel: Model<Role>,
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@InjectModel(Recruiter.name) private readonly recruiterModel: Model<Recruiter>,
		@InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
	) {}

	async onApplicationBootstrap() {
		this.logger.log("Checking if permissions and roles need to be seeded...");
		await this.seedPermissions();
		await this.seedRoles();
		await this.assignDefaultRolesToExistingUsers();
		this.logger.log("Seeding and Migration complete.");
	}

	private async seedPermissions() {
		const permissionNames = Object.values(PERMISSION);
		for (const name of permissionNames) {
			const exists = await this.permissionModel.findOne({ name });
			if (!exists) {
				await this.permissionModel.create({
					name,
					description: `Permission for ${name}`,
				});
				this.logger.log(`Created permission: ${name}`);
			}
		}
	}

	private async seedRoles() {
		const roles = [
			{
				name: USER_ROLE.ADMIN,
				permissions: ROLE_PERMISSIONS[USER_ROLE.ADMIN],
			},
			{
				name: USER_ROLE.RECRUITER,
				permissions: ROLE_PERMISSIONS[USER_ROLE.RECRUITER],
			},
			{
				name: USER_ROLE.USER,
				permissions: ROLE_PERMISSIONS[USER_ROLE.USER],
			},
		];

		for (const roleData of roles) {
			const permissionDocs = await this.permissionModel.find({
				name: { $in: roleData.permissions },
			});

			const roleExists = await this.roleModel.findOne({ name: roleData.name });
			if (!roleExists) {
				await this.roleModel.create({
					name: roleData.name,
					permissions: permissionDocs.map((p) => p._id),
				});
				this.logger.log(`Created role: ${roleData.name}`);
			} else {
				// Always sync permissions in dev/seeding phase
				await this.roleModel.findByIdAndUpdate(roleExists._id, {
					permissions: permissionDocs.map((p) => p._id),
				});
			}
		}
	}

	private async assignDefaultRolesToExistingUsers() {
		const adminRole = await this.roleModel.findOne({ name: USER_ROLE.ADMIN });
		const recruiterRole = await this.roleModel.findOne({ name: USER_ROLE.RECRUITER });
		const userRole = await this.roleModel.findOne({ name: USER_ROLE.USER });

		if (adminRole) {
			const result = await this.adminModel.updateMany(
				{ role: { $exists: false } },
				{ $set: { role: adminRole._id } },
			);
			if (result.modifiedCount > 0)
				this.logger.log(`Assigned default Admin role to ${result.modifiedCount} admins`);
		}

		if (recruiterRole) {
			const result = await this.recruiterModel.updateMany(
				{ role: { $exists: false } },
				{ $set: { role: recruiterRole._id } },
			);
			if (result.modifiedCount > 0)
				this.logger.log(`Assigned default Recruiter role to ${result.modifiedCount} recruiters`);
		}

		if (userRole) {
			const result = await this.userModel.updateMany(
				{ role: { $exists: false } },
				{ $set: { role: userRole._id } },
			);
			if (result.modifiedCount > 0)
				this.logger.log(`Assigned default User role to ${result.modifiedCount} users`);
		}
	}
}
