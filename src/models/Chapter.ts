import { BaseModel, IBaseModel } from "./BaseModel";
import { Unit } from "./Unit";
import { supabase } from "../supabaseClient";

interface IChapter extends IBaseModel {
	book_id: number;
	title: string;
	description: string;
	order: number;
}

export class Chapter extends BaseModel implements IChapter {
	book_id: number;
	title: string;
	description: string;
	order: number;
	units: Unit[];

	constructor(data: IChapter) {
		super(data);
		this.book_id = data.book_id;
		this.title = data.title;
		this.description = data.description;
		this.order = data.order;
		this.units = [];
	}

	static fromJson(json: Record<string, any>): Chapter {
		return new Chapter({
			...BaseModel.fromJson(json),
			book_id: json.book_id,
			title: json.title,
			description: json.description,
			order: json.order,
		});
	}

	toJson(): Record<string, any> {
		return {
			...super.toJson(),
			book_id: this.book_id,
			title: this.title,
			description: this.description,
			order: this.order,
		};
	}

	async create(): Promise<boolean> {
		try {
			const { data, error } = await supabase
				.from("Chapters")
				.insert([this.toJson()])
				.select()
				.single();

			if (error) {
				throw error;
			}

			this.id = data.id;
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
