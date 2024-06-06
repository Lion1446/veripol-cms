import { supabase } from '../supabaseClient';
import { Book } from '../models/Book';

export async function getBooksByAuthor(authorID: string): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('author_id', authorID);

    if (error) {
      throw error;
    }

    return data.map((book: Record<string, any>) => Book.fromJson(book));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}
