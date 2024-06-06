import { Outlet, Navigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import { useUserStore } from '../stores/UserStore';
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';
import { getBooksByAuthor } from '../services/books';
import { useDashboardStore } from '../stores/DashboardStore';
import { getCoursesByAuthor } from '../services/courses';
import { getLearningPathsByAuthor } from '../services/learningPaths';
import { getJobRolesByAuthor } from '../services/jobRoles';
import { getSkillsByAuthor } from '../services/skills';

const MainLayout = () => {
  const { user } = useUserStore((state) => ({
    user: state.user
  }));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const {
    setBooks,
    books,
    setCourses,
    setLearningPath,
    setJobRoles,
    setSkills
  } = useDashboardStore((state) => ({
    setBooks: state.setBooks,
    books: state.books,
    setCourses: state.setCourses,
    setLearningPath: state.setLearningPaths,
    setJobRoles: state.setJobRoles,
    setSkills: state.setSkills
  }));

  const fetchData = async () => {
    const authorID = user?.id ?? '';
    const fetchedBooks = await getBooksByAuthor(authorID);
    if (fetchedBooks) {
      setBooks(fetchedBooks);
    }
    const fetchedCourses = await getCoursesByAuthor(authorID);
    if (fetchedCourses) {
      setCourses(fetchedCourses);
    }
    const fetchedLearningPaths = await getLearningPathsByAuthor(authorID);
    if (fetchedLearningPaths) {
      setLearningPath(fetchedLearningPaths);
    }
    const fetchedJobRoles = await getJobRolesByAuthor(authorID);
    if (fetchedJobRoles) {
      setJobRoles(fetchedJobRoles);
    }
    const fetchedSkills = await getSkillsByAuthor(authorID);
    if (fetchedSkills) {
      setSkills(fetchedSkills);
    }
  };

  return (
    <div>
      <Outlet />
      <SideDrawer />
    </div>
  );
};

export default MainLayout;
