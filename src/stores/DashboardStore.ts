import { create } from "zustand";
import { User } from "../models/User";
import { Book } from "../models/Book";
import { ContentTag } from "../models/ContentTag";

interface DashboardStore {
  user: User | null;
  books: Book[] | null;
  courses: ContentTag[] | null;
  learningPath: ContentTag[] | null;
  jobRoles: ContentTag[] | null;
  skills: ContentTag[] | null;
  setUser: (user: User | null) => void;
  setBooks: (books: Book[] | null) => void;
  setCourses: (courses: ContentTag[] | null) => void;
  setLearningPath: (learningPath: ContentTag[] | null) => void;
  setJobRoles: (jobRoles: ContentTag[] | null) => void;
  setSkills: (skills: ContentTag[] | null) => void;
}

export const dashboardStore = create<DashboardStore>((set) => ({
  user: null,
  books: null,
  courses: null,
  learningPath: null,
  jobRoles: null,
  skills: null,
  setUser: (user) => set({ user }),
  setBooks: (books) => set({ books }),
  setCourses: (courses) => set({ courses }),
  setLearningPath: (learningPath) => set({ learningPath }),
  setJobRoles: (jobRoles) => set({ jobRoles }),
  setSkills: (skills) => set({ skills }),
}));
