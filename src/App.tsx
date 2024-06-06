import { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import MainLayout from './layouts/MainLayout';
import BooksCreateScreen from './screens/BooksCreateScreen';
import CoursesCreateScreen from './screens/CoursesCreateScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import CourseDetailSceen from './screens/CourseDetailScreen';
import JobRolesCreateScreen from './screens/JobRolesCreatesScreen';
import JobRoleDetailScreen from './screens/JobRoleDetailScreen';
import LearningPathsCreateScreen from './screens/LearningPathsCreateScreen';
import LearningPathDetailScreen from './screens/LearningPathDetailScreen';
import SkillsCreateScreen from './screens/SkillsCreateScreen';
import SkillDetailScreen from './screens/SkillDetailScreen';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const LibraryScreen = lazy(() => import('./screens/LibraryScreen'));
const CoursesScreen = lazy(() => import('./screens/CoursesScreen'));
const LearningPathsScreen = lazy(() => import('./screens/LearningPathsScreen'));
const JobRolesScreen = lazy(() => import('./screens/JobRolesScreen'));
const SkillsScreen = lazy(() => import('./screens/SkillsScreen'));

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20%'
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <Routes>
              <Route index element={<LoginScreen />} />
              <Route path="dashboard" element={<MainLayout />}>
                <Route path="books" element={<MainLayout />}>
                  <Route index element={<LibraryScreen />} />
                  <Route path="create" element={<BooksCreateScreen />} />
                  <Route path="book" element={<BookDetailScreen />} />
                </Route>
                <Route path="courses" element={<MainLayout />}>
                  <Route index element={<CoursesScreen />} />
                  <Route path="create" element={<CoursesCreateScreen />} />
                  <Route path="course" element={<CourseDetailSceen />} />
                </Route>
                <Route path="learning-paths" element={<MainLayout />}>
                  <Route index element={<LearningPathsScreen />} />
                  <Route
                    path="create"
                    element={<LearningPathsCreateScreen />}
                  />
                  <Route
                    path="learning-path"
                    element={<LearningPathDetailScreen />}
                  />
                </Route>
                <Route path="job-roles" element={<MainLayout />}>
                  <Route index element={<JobRolesScreen />} />
                  <Route path="create" element={<JobRolesCreateScreen />} />
                  <Route path="job-role" element={<JobRoleDetailScreen />} />
                </Route>
                <Route path="skills" element={<MainLayout />}>
                  <Route index element={<SkillsScreen />} />
                  <Route path="create" element={<SkillsCreateScreen />} />
                  <Route path="skill" element={<SkillDetailScreen />} />
                </Route>
              </Route>
              {/* Redirect any other unknown routes to LoginScreen */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
