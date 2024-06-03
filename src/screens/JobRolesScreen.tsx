import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../components/SearchBar';
import { useState, ChangeEvent, useEffect, ReactElement } from 'react';
import { ContentTag } from '../models/ContentTag';
import { getJobRolesByAuthor } from '../services/jobRoles';
import { useUserStore } from '../stores/UserStore';
import './style.css';
import DataTable from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { dashboardStore } from '../stores/DashboardStore';
import { getBooksByAuthor } from '../services/books';

const JobRolesScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { user } = useUserStore((state) => ({
    user: state.user
  }));

  const {
    setBooks,
    books,
    setJobRoles,
    jobRoles,
    setLearningPath,
    learningPaths,
    setSkills,
    skills
  } = dashboardStore((state) => ({
    setBooks: state.setBooks,
    books: state.books,
    setJobRoles: state.setJobRoles,
    jobRoles: state.jobRoles,
    setLearningPath: state.setLearningPaths,
    learningPaths: state.learningPaths,
    setSkills: state.setSkills,
    skills: state.skills
  }));

  const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterJobRoles = (data: ContentTag[], searchTerm: string) => {
    return data.filter((JobRole) =>
      JobRole.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredJobRoles = searchTerm
    ? filterJobRoles(jobRoles ?? [], searchTerm)
    : jobRoles;

  useEffect(() => {
    const fetchData = async () => {
      const authorID = user?.id ?? '';
      const fetchedBooks = await getBooksByAuthor(authorID);
      if (fetchedBooks) {
        setBooks(fetchedBooks);
      }
      const fetchedJobRoles = await getJobRolesByAuthor(authorID);
      if (fetchedJobRoles) {
        setJobRoles(fetchedJobRoles);
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
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <SearchBar
          title="Search Job Role Name"
          value={searchTerm}
          onChange={handleSearchOnChange}
        />
        <Button
          onClick={() => {
            navigate('/dashboard/job-roles/create');
          }}
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add New JobRole
        </Button>
      </div>
      <DataTable type="job_role" data={filteredJobRoles ?? []} />
    </div>
  );
};

export default JobRolesScreen;
