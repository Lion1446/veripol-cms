import { create } from 'zustand';
import { User } from '../models/User';
import { Book } from '../models/Book';
import { ContentTag } from '../models/ContentTag';

interface useDashboardStore {
  user: User | null;
  books: Book[] | null;
  courses: ContentTag[] | null;
  learningPaths: ContentTag[] | null;
  jobRoles: ContentTag[] | null;
  skills: ContentTag[] | null;

  book: Book | null;
  course: ContentTag | null;
  learningPath: ContentTag | null;
  jobRole: ContentTag | null;
  skill: ContentTag | null;
  contentTagBooks: { book: Book; position: number }[] | null;

  setUser: (user: User | null) => void;
  setBooks: (books: Book[] | null) => void;
  setCourses: (courses: ContentTag[] | null) => void;
  setLearningPaths: (learningPaths: ContentTag[] | null) => void;
  setJobRoles: (jobRoles: ContentTag[] | null) => void;
  setSkills: (skills: ContentTag[] | null) => void;

  setBook: (book: Book | null) => void;
  setCourse: (course: ContentTag | null) => void;
  setLearningPath: (learningPath: ContentTag | null) => void;
  setJobRole: (jobRole: ContentTag | null) => void;
  setSkill: (skill: ContentTag | null) => void;
  setContentTagBooks: (
    contentTagBooks: { book: Book; position: number }[] | null
  ) => void;
}

export const useDashboardStore = create<useDashboardStore>((set) => ({
  user: null,
  books: null,
  courses: null,
  learningPaths: null,
  jobRoles: null,
  skills: null,
  book: null,
  course: null,
  learningPath: null,
  jobRole: null,
  skill: null,
  contentTagBooks: null,
  setUser: (user) => set({ user }),
  setBooks: (books) => set({ books }),
  setCourses: (courses) => set({ courses }),
  setLearningPaths: (learningPaths) => set({ learningPaths }),
  setJobRoles: (jobRoles) => set({ jobRoles }),
  setSkills: (skills) => set({ skills }),
  setBook: (book) => set({ book }),
  setCourse: (course) => set({ course }),
  setLearningPath: (learningPath) => set({ learningPath }),
  setJobRole: (jobRole) => set({ jobRole }),
  setSkill: (skill) => set({ skill }),
  setContentTagBooks: (contentTagBooks) => set({ contentTagBooks })
}));
