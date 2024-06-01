// src/models/Book.ts
import { BaseModel, IBaseModel } from "./BaseModel";
import { Chapter } from "./Chapter";
import { supabase } from "../supabaseClient";

interface IBook extends IBaseModel {
	title: string;
	description: string;
	difficultyLevel: number;
	authorID: string;
	isPublished: boolean;
}

export class Book extends BaseModel implements IBook {
	title: string;
	description: string;
	difficultyLevel: number;
	authorID: string;
	isPublished: boolean;
	// chapters: Chapter[];

	constructor(data: IBook) {
		super(data);
		this.title = data.title;
		this.description = data.description;
		this.difficultyLevel = data.difficultyLevel;
		this.authorID = data.authorID;
		this.isPublished = data.isPublished;
		// this.chapters = [];
	}

	static fromJson(json: Record<string, any>): Book {
		return new Book({
			...BaseModel.fromJson(json),
			title: json.title,
			description: json.description,
			difficultyLevel: json.difficulty_level,
			authorID: json.author_id,
			isPublished: json.is_published,
		});
	}

	toJson(): Record<string, any> {
		return {
			...super.toJson(),
			title: this.title,
			description: this.description,
			difficulty_level: this.difficultyLevel,
			author_id: this.authorID,
			is_published: this.isPublished,
		};
	}

	async create(): Promise<boolean> {
		try {
			const { data, error } = await supabase
				.from("books")
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
