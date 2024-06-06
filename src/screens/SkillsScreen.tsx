import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../components/SearchBar';
import { useState, ChangeEvent } from 'react';
import { ContentTag } from '../models/ContentTag';
import './style.css';
import DataTable from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../stores/DashboardStore';

const SkillsScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { skills } = useDashboardStore(({ skills }) => ({ skills }));

  const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterSkills = (data: ContentTag[], searchTerm: string) => {
    return data.filter((Skill) =>
      Skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredSkills = searchTerm
    ? filterSkills(skills ?? [], searchTerm)
    : skills;

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
          title="Search Skill Name"
          value={searchTerm}
          onChange={handleSearchOnChange}
        />
        <Button
          onClick={() => {
            navigate('/dashboard/skills/create');
          }}
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add New Skill
        </Button>
      </div>
      <DataTable type="skill" data={filteredSkills ?? []} />
    </div>
  );
};

export default SkillsScreen;
