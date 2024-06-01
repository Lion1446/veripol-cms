import { lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import {
	createTheme,
	ThemeProvider,
	CssBaseline,
	CircularProgress,
} from "@mui/material";
import MainLayout from "./layouts/MainLayout";
import BooksCreateScreen from "./screens/BooksCreateScreen";
import CoursesCreateScreen from "./screens/CoursesCreateScreen";

const LoginScreen = lazy(() => import("./screens/LoginScreen"));
const LibraryScreen = lazy(() => import("./screens/LibraryScreen"));
const CoursesScreen = lazy(() => import("./screens/CoursesScreen"));
const LearningPathsScreen = lazy(() => import("./screens/LearningPathsScreen"));
const JobRolesScreen = lazy(() => import("./screens/JobRolesScreen"));
const SkillsScreen = lazy(() => import("./screens/SkillsScreen"));

const theme = createTheme({
	typography: {
		fontFamily: "Roboto, sans-serif",
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Suspense
					fallback={
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								marginTop: "20%",
							}}
						>
							<CircularProgress />
						</div>
					}
				>
					<Routes>
						<Route index element={<LoginScreen />} />
						<Route path='dashboard' element={<MainLayout />}>
							<Route path='books' element={<MainLayout />}>
								<Route index element={<LibraryScreen />} />
								<Route path='create' element={<BooksCreateScreen />} />
							</Route>
							<Route path='courses' element={<MainLayout />}>
								<Route index element={<CoursesScreen />} />
								<Route path='create' element={<CoursesCreateScreen />} />
							</Route>
							<Route path='learning-paths' element={<LearningPathsScreen />} />
							<Route path='job-roles' element={<JobRolesScreen />} />
							<Route path='skills' element={<SkillsScreen />} />
						</Route>
						{/* Redirect any other unknown routes to LoginScreen */}
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</Suspense>
			</Router>
		</ThemeProvider>
	);
}

export default App;
