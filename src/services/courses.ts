import { supabase } from "../supabaseClient";
import { ContentTag } from "../models/ContentTag";

export async function getCoursesByAuthor(
	authorID: string
): Promise<ContentTag[]> {
	try {
		const { data: coursesData, error: coursesError } = await supabase
			.from("content_tags")
			.select("*")
			.eq("author_id", authorID)
			.eq("type", "course");

		if (coursesError) {
			throw coursesError;
		}

		const coursesWithBooksCount = await Promise.all(
			coursesData.map(async (course: Record<string, any>) => {
				const { data: booksData, error: booksError } = await supabase
					.from("book_contenttags")
					.select("book_id")
					.eq("contenttag_id", course.id);

				if (booksError) {
					throw booksError;
				}

				return {
					...course,
					booksCount: booksData.length, // Number of books under this course
				};
			})
		);

		return coursesWithBooksCount.map((course: Record<string, any>) =>
			ContentTag.fromJson(course)
		);
	} catch (error) {
		console.error("Error fetching courses:", error);
		return [];
	}
}
