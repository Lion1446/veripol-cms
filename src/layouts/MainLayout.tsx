// MainLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import { useUserStore } from '../stores/UserStore';

const MainLayout = () => {
  const { user } = useUserStore((state) => ({
    user: state.user
  }));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Outlet />
      <SideDrawer />
    </div>
  );
};

export default MainLayout;
