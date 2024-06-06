import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../components/SearchBar';
import { useState, useEffect, ChangeEvent } from 'react';
import { ContentTag } from '../models/ContentTag';
import { getCoursesByAuthor } from '../services/courses';
import { useUserStore } from '../stores/UserStore';
import './style.css';
import DataTable from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../stores/DashboardStore';
import { getBooksByAuthor } from '../services/books';
import { getLearningPathsByAuthor } from '../services/learningPaths';
import { getJobRolesByAuthor } from '../services/jobRoles';
import { getSkillsByAuthor } from '../services/skills';

const CoursesScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { user } = useUserStore(({ user }) => ({ user }));

  const {
    setBooks,
    setCourses,
    setLearningPaths,
    setJobRoles,
    setSkills,
    courses
  } = useDashboardStore(
    ({
      setBooks,
      setCourses,
      setLearningPaths,
      setJobRoles,
      setSkills,
      courses
    }) => ({
      setBooks,
      setCourses,
      setLearningPaths,
      setJobRoles,
      setSkills,
      courses
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      const authorID = user?.id;
      if (!authorID) return;
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
        setLearningPaths(fetchedLearningPaths);
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

  const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = searchTerm
    ? courses?.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courses;

  return (
    <div className="content-section">
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <SearchBar
          title="Search Course Name"
          value={searchTerm}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(event.target.value)
          }
        />
        <Button
          onClick={() => navigate('/dashboard/courses/create')}
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add New Course
        </Button>
      </div>
      <DataTable type="course" data={filteredCourses ?? []} />
    </div>
  );
};

export default CoursesScreen;
