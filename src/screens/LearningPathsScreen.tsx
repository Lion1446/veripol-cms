import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "../components/SearchBar";
import { useState, ChangeEvent, useEffect, ReactElement } from "react";
import { ContentTag } from "../models/ContentTag";
import { useUserStore } from "../stores/UserStore";
import "./style.css";
import DataTable from "../components/Table";
import { useNavigate } from "react-router-dom";
import { dashboardStore } from "../stores/DashboardStore";
import { getBooksByAuthor } from "../services/books";
import { getLearningPathsByAuthor } from "../services/learningPaths";
import { getJobRolesByAuthor } from "../services/jobRoles";
import { getSkillsByAuthor } from "../services/skills";
import { getCoursesByAuthor } from "../services/courses";

const LearningPathsScreen = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState<string>("");

	const { user } = useUserStore((state) => ({
		user: state.user,
	}));

	const {
		setBooks,
		books,
		setCourses,
		courses,
		setLearningPaths,
		LearningPaths,
		setLearningPath,
		learningPaths,
		setJobRoles,
		jobRoles,
		setSkills,
		skills,
	} = dashboardStore((state) => ({
		setBooks: state.setBooks,
		books: state.books,
		setLearningPaths: state.setLearningPaths,
		LearningPaths: state.learningPaths,
		setCourses: state.setCourses,
		courses: state.courses,
		setLearningPath: state.setLearningPaths,
		learningPaths: state.learningPaths,
		setJobRoles: state.setJobRoles,
		jobRoles: state.jobRoles,
		setSkills: state.setSkills,
		skills: state.skills,
	}));

	const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const filterLearningPaths = (data: ContentTag[], searchTerm: string) => {
		return data.filter((LearningPath) =>
			LearningPath.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	const filteredLearningPaths = searchTerm
		? filterLearningPaths(LearningPaths ?? [], searchTerm)
		: LearningPaths;

	useEffect(() => {
		const fetchData = async () => {
			const authorID = user?.id ?? "";
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
		if (user) {
			fetchData();
		}
	}, [user]);

	return (
		<div className='content-section'>
			<div
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					gap: "20px",
					justifyContent: "center",
					padding: "20px",
				}}
			>
				<SearchBar
					title='Search Learning Path Name'
					value={searchTerm}
					onChange={handleSearchOnChange}
				/>
				<Button
					onClick={() => {
						navigate("/dashboard/learning-paths/create");
					}}
					size='large'
					variant='contained'
					startIcon={<AddIcon />}
				>
					Add New Learning Path
				</Button>
			</div>
			<DataTable type='learning_path' data={filteredLearningPaths ?? []} />
		</div>
	);
};

export default LearningPathsScreen;
