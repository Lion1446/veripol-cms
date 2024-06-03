export interface IBaseModel {
	id: string;
	created_at?: string;
	updated_at?: string;
}

export class BaseModel implements IBaseModel {
	id: string;
	created_at?: string;
	updated_at?: string;

	constructor(data: IBaseModel) {
		this.id = data.id;
		this.created_at = data.created_at;
		this.updated_at = data.updated_at;
	}

	static fromJson(json: Record<string, any>): BaseModel {
		return new BaseModel({
			id: json.id,
			created_at: json.created_at,
			updated_at: json.updated_at,
		});
	}

	toJson(): Record<string, any> {
		return {
			id: this.id,
			created_at: this.created_at,
			updated_at: this.updated_at,
		};
	}
}
