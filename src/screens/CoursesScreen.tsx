import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "../components/SearchBar";
import { useState, ChangeEvent, useEffect, ReactElement } from "react";
import { ContentTag } from "../models/ContentTag";
import { getCoursesByAuthor } from "../services/courses";
import { useUserStore } from "../stores/UserStore";
import "./style.css";
import DataTable from "../components/Table";
import { useNavigate } from "react-router-dom";

const CoursesScreen = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [courses, setCourses] = useState<ContentTag[]>([]);

	const { user } = useUserStore((state) => ({
		user: state.user,
	}));

	const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	useEffect(() => {
		const fetchCourses = async () => {
			const authorID = user?.id ?? "";
			const fetchedCourses = await getCoursesByAuthor(authorID);
			console.log(fetchedCourses);
			setCourses(fetchedCourses);
		};

		if (user) {
			fetchCourses();
		}
	}, [user]);

	const filterBooks = (data: ContentTag[], searchTerm: string) => {
		return data.filter((course) =>
			course.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	const filteredCourses = searchTerm
		? filterBooks(courses, searchTerm)
		: courses;

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
					title='Search Course Name'
					value={searchTerm}
					onChange={handleSearchOnChange}
				/>
				<Button
					onClick={() => {
						navigate("/dashboard/courses/create");
					}}
					size='large'
					variant='contained'
					startIcon={<AddIcon />}
				>
					Add New Course
				</Button>
			</div>
			<DataTable data={filteredCourses} />
		</div>
	);
};

export default CoursesScreen;
