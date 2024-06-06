import { supabase } from '../SupabaseClient';
import { ContentTag } from '../models/ContentTag';

export async function getJobRolesByAuthor(
  authorID: string
): Promise<ContentTag[]> {
  try {
    const { data, error } = await supabase
      .from('content_tags')
      .select('*')
      .eq('author_id', authorID)
      .eq('type', 'job_role');

    if (error) {
      throw error;
    }

    return data.map((contenttag: Record<string, any>) =>
      ContentTag.fromJson(contenttag)
    );
  } catch (error) {
    console.error('Error fetching job roles:', error);
    return [];
  }
}
