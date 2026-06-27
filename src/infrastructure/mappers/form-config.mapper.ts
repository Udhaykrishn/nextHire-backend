import { FormConfigEntity } from "@/domain/entity/form-config.entity";
import type { FormAudience, FormFieldData } from "@/domain/types/form-config-data.type";
import type { FormConfigDocument } from "../db/mongodb/models/form-config.schema";

export const FormConfigMapper = {
	toDomain(document: FormConfigDocument): FormConfigEntity {
		const fields: FormFieldData[] = (document.fields ?? []).map((field) => ({
			key: field.key,
			label: field.label,
			type: field.type as FormFieldData["type"],
			placeholder: field.placeholder,
			required: field.required,
			enabled: field.enabled,
			locked: field.locked,
			custom: field.custom,
			order: field.order,
			options: field.options,
			minLength: field.minLength,
			pattern: field.pattern,
			errorMessage: field.errorMessage,
		}));

		return new FormConfigEntity(
			document._id as string,
			document.formKey,
			document.name,
			document.audience as FormAudience,
			fields,
			(document as unknown as { createdAt?: Date }).createdAt,
			(document as unknown as { updatedAt?: Date }).updatedAt,
		);
	},

	toPersistence(entity: FormConfigEntity): Partial<FormConfigDocument> {
		return {
			formKey: entity.formKey,
			name: entity.name,
			audience: entity.audience,
			fields: entity.fields.map((field) => ({
				key: field.key,
				label: field.label,
				type: field.type,
				placeholder: field.placeholder,
				required: field.required,
				enabled: field.enabled,
				locked: field.locked,
				custom: field.custom,
				order: field.order,
				options: field.options,
				minLength: field.minLength,
				pattern: field.pattern,
				errorMessage: field.errorMessage,
			})),
		};
	},
};
