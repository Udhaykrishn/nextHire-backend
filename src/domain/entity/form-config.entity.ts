import type { FormAudience, FormConfigCreateData, FormFieldData } from "@/domain/types/form-config-data.type";

export class FormConfigEntity {
	constructor(
		public readonly id: string | undefined,
		public formKey: string,
		public name: string,
		public audience: FormAudience,
		public fields: FormFieldData[],
		public createdAt?: Date,
		public updatedAt?: Date,
	) {}

	static create(payload: FormConfigCreateData): FormConfigEntity {
		return new FormConfigEntity(
			undefined,
			payload.formKey,
			payload.name,
			payload.audience,
			FormConfigEntity.normalize(payload.fields),
		);
	}

	/**
	 * Replace the editable parts of each field while protecting locked fields:
	 * locked fields keep their type and stay enabled/required and cannot be removed.
	 */
	updateFields(incoming: FormFieldData[]): void {
		const lockedByKey = new Map(this.fields.filter((f) => f.locked).map((f) => [f.key, f]));

		const merged = incoming.map((field) => {
			const locked = lockedByKey.get(field.key);
			if (locked) {
				return {
					...field,
					type: locked.type,
					locked: true,
					custom: false,
					enabled: true,
					required: locked.required,
				};
			}
			return { ...field, locked: false };
		});

		// Guarantee no locked field was dropped.
		for (const [key, locked] of lockedByKey) {
			if (!merged.some((f) => f.key === key)) merged.push(locked);
		}

		this.fields = FormConfigEntity.normalize(merged);
	}

	/** Sort by order and re-index so order is always contiguous from 0. */
	private static normalize(fields: FormFieldData[]): FormFieldData[] {
		return [...fields].sort((a, b) => a.order - b.order).map((field, index) => ({ ...field, order: index }));
	}
}
