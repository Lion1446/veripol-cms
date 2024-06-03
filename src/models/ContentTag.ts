import { BaseModel, IBaseModel } from './BaseModel';
import { Book } from './Book';
import { supabase } from '../supabaseClient';

interface IContentTag extends IBaseModel {
  name: string;
  type: string;
  description: string;
  author_id: string;
  books: { book: Book; position: number }[];
}

export class ContentTag extends BaseModel implements IContentTag {
  name: string;
  type: string;
  description: string;
  author_id: string;
  books: { book: Book; position: number }[];

  constructor(data: IContentTag) {
    super(data);
    this.name = data.name;
    this.type = data.type;
    this.description = data.description;
    this.author_id = data.author_id;
    this.books = data.books || [];
  }

  static fromJson(json: Record<string, any>): ContentTag {
    return new ContentTag({
      ...BaseModel.fromJson(json),
      name: json.name,
      type: json.type,
      description: json.description,
      author_id: json.author_id,
      books: json.books?.map((item: any) => ({
        book: Book.fromJson(item.book),
        position: item.position
      }))
    });
  }

  toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      name: this.name,
      type: this.type,
      description: this.description,
      author_id: this.author_id,
      books: this.books.map((item) => ({
        book: item.book.toJson(),
        position: item.position
      }))
    };
  }

  async create(): Promise<boolean> {
    try {
      // Insert the content tag into the content_tags table
      const { data: contentTagData, error: contentTagError } = await supabase
        .from('content_tags')
        .insert([
          {
            ...super.toJson(),
            name: this.name,
            type: this.type,
            description: this.description,
            author_id: this.author_id
          }
        ])
        .select()
        .single();

      if (contentTagError) {
        throw contentTagError;
      }

      this.id = contentTagData.id;

      // Insert books into the book_contenttags table
      const bookInsertPromises = this.books.map(async (item) => {
        const bookData = {
          contenttag_id: this.id,
          book_id: item.book.id,
          position: item.position
        };
        const { error } = await supabase
          .from('book_contenttags')
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
        contenttag_id: this.id,
        book_id: book.id,
        position: position
      };

      const { data, error } = await supabase
        .from('book_contenttags')
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

  async update(): Promise<boolean> {
    try {
      // Update the content tag details in the database
      const { data, error } = await supabase
        .from('content_tags')
        .update({
          name: this.name,
          description: this.description,
          // Update other fields as needed
          updated_at: new Date().toISOString()
        })
        .match({ id: this.id });

      if (error) {
        throw error;
      }

      // Update or insert new book entries in the book_contenttags table
      const bookInsertPromises = this.books.map(async (item) => {
        // Check if the book entry already exists in the database
        const { data: existingData, error: existingError } = await supabase
          .from('book_contenttags')
          .select()
          .eq('contenttag_id', this.id)
          .eq('book_id', item.book.id)
          .single();

        if (existingData) {
          // If the book entry exists, update its position
          await supabase
            .from('book_contenttags')
            .update({ position: item.position })
            .match({ contenttag_id: this.id, book_id: item.book.id });
        } else {
          // If the book entry does not exist, insert a new entry
          await supabase.from('book_contenttags').insert([
            {
              contenttag_id: this.id,
              book_id: item.book.id,
              position: item.position
            }
          ]);
        }
      });

      await Promise.all(bookInsertPromises);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(): Promise<boolean> {
    try {
      // Delete associated records from the book_contenttags table
      const { error: bookError } = await supabase
        .from('book_contenttags')
        .delete()
        .match({ contenttag_id: this.id });

      if (bookError) {
        throw bookError;
      }

      // Delete the content tag from the content_tags table
      const { error: contentTagError } = await supabase
        .from('content_tags')
        .delete()
        .match({ id: this.id });

      if (contentTagError) {
        throw contentTagError;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private async getBookById(bookId: string): Promise<Book | null> {
    try {
      // Fetch the book by its ID from the database
      const { data, error } = await supabase
        .from('books')
        .select()
        .eq('id', bookId)
        .single();

      if (error) {
        throw error;
      }

      return data ? Book.fromJson(data) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getBooksById(): Promise<void> {
    try {
      // Fetch books associated with the content tag ID from the database
      const { data, error } = await supabase
        .from('book_contenttags')
        .select('book_id, position')
        .eq('contenttag_id', this.id);

      if (error) {
        throw error;
      }

      // Process the retrieved data and assign it to the books field
      const booksData = data ?? [];
      this.books = await Promise.all(
        booksData.map(async (item: any) => ({
          book: (await this.getBookById(item.book_id))!,
          position: item.position
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }
}
