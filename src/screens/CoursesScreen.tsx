import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../components/SearchBar';
import { useState, ChangeEvent } from 'react';
import './style.css';
import DataTable from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../stores/DashboardStore';

const CoursesScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { courses } = useDashboardStore(({ courses }) => ({ courses }));

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
          onChange={handleSearchOnChange}
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
