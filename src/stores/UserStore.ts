import { create } from 'zustand';
import { User } from '../models/User';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logOut: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logOut: () => set({ user: null })
}));
