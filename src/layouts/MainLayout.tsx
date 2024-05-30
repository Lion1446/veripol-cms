import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SideDrawer from "../components/SideDrawer";

const MainLayout = () => {
	const { user } = useUser();

	if (!user) {
		return <Navigate to='/' replace />;
	}

	return (
		<div>
			<Outlet />
			<SideDrawer />
		</div>
	);
};

export default MainLayout;
