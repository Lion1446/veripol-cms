import { supabase } from "../supabaseClient";
import { ContentTag } from "../models/ContentTag";

export async function getCoursesByAuthor(
	authorID: string
): Promise<ContentTag[]> {
	try {
		const { data, error } = await supabase
			.from("books")
			.select("*")
			.eq("author_id", authorID)
			.eq("type", "course");

		if (error) {
			throw error;
		}

		return data.map((course: Record<string, any>) =>
			ContentTag.fromJson(course)
		);
	} catch (error) {
		console.error("Error fetching courses:", error);
		return [];
	}
}
