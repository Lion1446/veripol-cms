// src/models/ContentTag.ts
import { BaseModel, IBaseModel } from "./BaseModel";
import { Book } from "./Book";
import { supabase } from "../supabaseClient";

interface IContentTag extends IBaseModel {
	name: string;
	type: string;
	description: string;
	books: { book: Book; position: number }[];
}

export class ContentTag extends BaseModel implements IContentTag {
	name: string;
	type: string;
	description: string;
	books: { book: Book; position: number }[];

	constructor(data: IContentTag) {
		super(data);
		this.name = data.name;
		this.type = data.type;
		this.description = data.description;
		this.books = data.books || [];
	}

	static fromJson(json: Record<string, any>): ContentTag {
		return new ContentTag({
			...BaseModel.fromJson(json),
			name: json.name,
			type: json.type,
			description: json.description,
			books: json.books.map((item: any) => ({
				book: Book.fromJson(item.book),
				position: item.position,
			})),
		});
	}

	toJson(): Record<string, any> {
		return {
			...super.toJson(),
			name: this.name,
			type: this.type,
			description: this.description,
			books: this.books.map((item) => ({
				book: item.book.toJson(),
				position: item.position,
			})),
		};
	}

	async create(): Promise<boolean> {
		try {
			// Insert the content tag into the content_tags table
			const { data: contentTagData, error: contentTagError } = await supabase
				.from("content_tags")
				.insert([this.toJson()])
				.select()
				.single();

			if (contentTagError) {
				throw contentTagError;
			}

			this.id = contentTagData.id;

			// Insert books into the book_contenttags table
			const bookInsertPromises = this.books.map(async (item) => {
				const bookData = {
					content_tag_id: this.id,
					book_id: item.book.id,
					position: item.position,
				};
				const { error } = await supabase
					.from("book_contenttags")
					.insert([bookData]);

				if (error) {
					throw error;
				}
			});

			await Promise.all(bookInsertPromises);

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async addBook(book: Book, position: number): Promise<boolean> {
		try {
			this.books.push({ book, position });

			// Update the content tag in the database
			const bookData = {
				content_tag_id: this.id,
				book_id: book.id,
				position: position,
			};

			const { data, error } = await supabase
				.from("book_contenttags")
				.insert([bookData])
				.single();

			if (error) {
				throw error;
			}

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
