import { supabase } from "../supabaseClient";
import { ContentTag } from "../models/ContentTag";

export async function getSkillsByAuthor(
	authorID: string
): Promise<ContentTag[]> {
	try {
		const { data, error } = await supabase
			.from("content_tags")
			.select("*")
			.eq("author_id", authorID)
			.eq("type", "skill");

		if (error) {
			throw error;
		}

		return data.map((contenttag: Record<string, any>) =>
			ContentTag.fromJson(contenttag)
		);
	} catch (error) {
		console.error("Error fetching skills:", error);
		return [];
	}
}
