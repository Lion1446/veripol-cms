// node src/utils/CreateBook.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jehxchqyswfjjicxzbyl.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaHhjaHF5c3dmamppY3h6YnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4NjE2MDMsImV4cCI6MjAzMjQzNzYwM30.rGuYkxg8vV_QSC9irqfX5TC3pcVcASr2dMOa5jge1hw';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL and/or Supabase Key not provided in environment variables.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

class BaseModel {
  constructor(data) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromJson(json) {
    return {
      id: json.id,
      createdAt: json.created_at,
      updatedAt: json.updated_at
    };
  }

  toJson() {
    return {
      id: this.id,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}

class Book extends BaseModel {
  constructor(data) {
    super(data);
    this.title = data.title;
    this.description = data.description;
    this.difficultyLevel = data.difficultyLevel;
    this.authorID = data.authorID;
    this.authorEmail = data.authorEmail;
    this.isPublished = data.isPublished;
    this.chapters = [];
  }

  static fromJson(json) {
    return new Book({
      ...BaseModel.fromJson(json),
      title: json.title,
      description: json.description,
      difficultyLevel: json.difficulty_level,
      authorID: json.author_id,
      authorEmail: json.author_email,
      isPublished: json.is_published
    });
  }

  toJson() {
    return {
      ...super.toJson(),
      title: this.title,
      description: this.description,
      difficulty_level: this.difficultyLevel,
      author_id: this.authorID,
      is_published: this.isPublished
    };
  }

  async create() {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            title: this.title,
            description: this.description,
            difficulty_level: this.difficultyLevel,
            author_id: this.authorID,
            is_published: this.isPublished,
            created_at: this.createdAt,
            updated_at: this.updatedAt
          }
        ])
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

async function generateAndPublishBook() {
  const bookData = {
    title: 'Sample Book Title',
    description: 'This is a description of the sample book.',
    difficultyLevel: 3,
    authorID: '43722a32-ae1c-4f79-8153-380a779097d5',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const book = new Book(bookData);

  const success = await book.create();

  if (success) {
    console.log('Book created successfully:', book);
  } else {
    console.log('Failed to create book');
  }
}

// Execute the function
generateAndPublishBook();
