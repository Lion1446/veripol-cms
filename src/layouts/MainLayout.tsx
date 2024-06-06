import { Outlet, Navigate } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import { useUserStore } from '../stores/UserStore';
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';
import { Box, CircularProgress } from '@mui/material';
import { getBooksByAuthor } from '../services/books';
import { useDashboardStore } from '../stores/DashboardStore';
import { getCoursesByAuthor } from '../services/courses';
import { getLearningPathsByAuthor } from '../services/learningPaths';
import { getJobRolesByAuthor } from '../services/jobRoles';
import { getSkillsByAuthor } from '../services/skills';
import { ContentTag } from '../models/ContentTag';
import { Book } from '../models/Book';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const MainLayout = () => {
  const { user } = useUserStore((state) => ({
    user: state.user
  }));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const { setBooks, setCourses, setLearningPaths, setJobRoles, setSkills } =
    useDashboardStore((state) => ({
      setBooks: state.setBooks,
      setCourses: state.setCourses,
      setLearningPaths: state.setLearningPaths,
      setJobRoles: state.setJobRoles,
      setSkills: state.setSkills
    }));

  const {
    data: booksData,
    error: booksError,
    isLoading: booksLoading
  } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const books = await getBooksByAuthor(user.id);
      return books; // Ensure that data is returned here
    }
  });

  const {
    data: coursesData,
    error: coursesError,
    isLoading: coursesLoading
  } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const courses = await getCoursesByAuthor(user.id);
      return courses; // Ensure that data is returned here
    }
  });

  const {
    data: learningPathsData,
    error: learningPathsError,
    isLoading: learningPathsLoading
  } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: async () => {
      const learningPaths = await getLearningPathsByAuthor(user.id);
      return learningPaths; // Ensure that data is returned here
    }
  });

  const {
    data: jobRolesData,
    error: jobRolesError,
    isLoading: jobRolesLoading
  } = useQuery({
    queryKey: ['jobRoles'],
    queryFn: async () => {
      const jobRoles = await getJobRolesByAuthor(user.id);
      return jobRoles; // Ensure that data is returned here
    }
  });

  const {
    data: skillsData,
    error: skillsError,
    isLoading: skillsLoading
  } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const skills = await getSkillsByAuthor(user.id);
      return skills; // Ensure that data is returned here
    }
  });

  useEffect(() => {
    if (booksData) {
      setBooks(booksData);
    }
  }, [booksData]);

  useEffect(() => {
    if (coursesData) {
      setCourses(coursesData);
    }
  }, [coursesData]);

  useEffect(() => {
    if (learningPathsData) {
      setLearningPaths(learningPathsData);
    }
  }, [learningPathsData]);

  useEffect(() => {
    if (jobRolesData) {
      setJobRoles(jobRolesData);
    }
  }, [jobRolesData]);

  useEffect(() => {
    if (skillsData) {
      setSkills(skillsData);
    }
  }, [skillsData]);

  if (
    booksLoading ||
    coursesLoading ||
    learningPathsLoading ||
    jobRolesLoading ||
    skillsLoading
  ) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(5px)',
          zIndex: 1300
        }}
      >
        <CircularProgress size={100} color="primary" />
      </Box>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <SideDrawer />
    </QueryClientProvider>
  );
};

export default MainLayout;
