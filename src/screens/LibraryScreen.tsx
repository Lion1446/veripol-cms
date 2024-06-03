// LibraryScreen.tsx
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "../components/SearchBar";
import { useState, ChangeEvent, useEffect, ReactElement } from "react";
import { Book } from "../models/Book";
import { getBooksByAuthor } from "../services/books";
import { useUserStore } from "../stores/UserStore";
import { dashboardStore } from "../stores/DashboardStore";
import "./style.css";
import DataTable from "../components/Table";
import { useNavigate } from "react-router-dom";
import { getCoursesByAuthor } from "../services/courses";
import { getLearningPathsByAuthor } from "../services/learningPaths";
import { getJobRolesByAuthor } from "../services/jobRoles";
import { getSkillsByAuthor } from "../services/skills";

const LibraryScreen = (): ReactElement => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState<string>("");

	const { user } = useUserStore((state) => ({
		user: state.user,
	}));

	const {
		setBooks,
		books,
		setCourses,
		setLearningPath,
		setJobRoles,
		setSkills,
	} = dashboardStore((state) => ({
		setBooks: state.setBooks,
		books: state.books,
		setCourses: state.setCourses,
		setLearningPath: state.setLearningPaths,
		setJobRoles: state.setJobRoles,
		setSkills: state.setSkills,
	}));

	const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

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

	const filterBooks = (data: Book[], searchTerm: string) => {
		return data.filter((book) =>
			book.title.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	const filteredBooks = searchTerm
		? filterBooks(books ?? [], searchTerm)
		: books;

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
					title='Search Book Name'
					value={searchTerm}
					onChange={handleSearchOnChange}
				/>
				<Button
					onClick={() => {
						navigate("/dashboard/books/create");
					}}
					size='large'
					variant='contained'
					startIcon={<AddIcon />}
				>
					Add New Book
				</Button>
			</div>
			<DataTable type='book' data={filteredBooks ?? []} />
		</div>
	);
};

export default LibraryScreen;
