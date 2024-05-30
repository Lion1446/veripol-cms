export interface IBaseModel {
	id: string;
	created?: string;
	updated?: string;
}

export class BaseModel implements IBaseModel {
	id: string;
	created?: string;
	updated?: string;

	constructor(data: IBaseModel) {
		this.id = data.id;
		this.created = data.created;
		this.updated = data.updated;
	}

	static fromJson(json: Record<string, any>): BaseModel {
		return new BaseModel({
			id: json.id,
			created: json.created,
			updated: json.updated,
		});
	}

	toJson(): Record<string, any> {
		return {
			id: this.id,
			created_at: this.created,
			updated_at: this.updated,
		};
	}
}
