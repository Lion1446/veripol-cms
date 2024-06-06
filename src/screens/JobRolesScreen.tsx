import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../components/SearchBar';
import { useState, ChangeEvent } from 'react';
import { ContentTag } from '../models/ContentTag';
import './style.css';
import DataTable from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../stores/DashboardStore';

const JobRolesScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { jobRoles } = useDashboardStore(({ jobRoles }) => ({ jobRoles }));

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
