import create from "zustand";
import { User } from "../models/User";

export const useUserStore = create((set) => ({
	user: null as User | null,
	logOut: () => {
		set({ user: null });
	},
}));
