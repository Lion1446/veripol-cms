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
import { dashboardStore } from "../stores/DashboardStore";
import { getBooksByAuthor } from "../services/books";
import { getLearningPathsByAuthor } from "../services/learningPaths";
import { getJobRolesByAuthor } from "../services/jobRoles";
import { getSkillsByAuthor } from "../services/skills";

const CoursesScreen = () => {
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
    setLearningPath,
    learningPaths,
    setJobRoles,
    jobRoles,
    setSkills,
    skills,
  } = dashboardStore((state) => ({
    setBooks: state.setBooks,
    books: state.books,
    setCourses: state.setCourses,
    courses: state.courses,
    setLearningPath: state.setLearningPath,
    learningPaths: state.learningPath,
    setJobRoles: state.setJobRoles,
    jobRoles: state.jobRoles,
    setSkills: state.setSkills,
    skills: state.skills,
  }));

  const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterCourses = (data: ContentTag[], searchTerm: string) => {
    return data.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredCourses = searchTerm
    ? filterCourses(courses ?? [], searchTerm)
    : courses;

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
    <div className="content-section">
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
          title="Search Course Name"
          value={searchTerm}
          onChange={handleSearchOnChange}
        />
        <Button
          onClick={() => {
            navigate("/dashboard/courses/create");
          }}
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add New Course
        </Button>
      </div>
      <DataTable data={filteredCourses ?? []} />
    </div>
  );
};

export default CoursesScreen;
