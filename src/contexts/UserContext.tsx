import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
	id: string;
	email: string;
}

type UserContextType = {
	user: User | null;
	setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType>({
	user: null,
	setUser: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

// Custom hook for using the UserContext
export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
