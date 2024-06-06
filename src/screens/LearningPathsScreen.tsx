import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../components/SearchBar';
import { useState, ChangeEvent } from 'react';
import { ContentTag } from '../models/ContentTag';
import './style.css';
import DataTable from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../stores/DashboardStore';

const LearningPathsScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { learningPaths } = useDashboardStore(({ learningPaths }) => ({
    learningPaths
  }));

  const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterLearningPaths = (data: ContentTag[], searchTerm: string) => {
    return data.filter((learningPath) =>
      learningPath.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredLearningPaths = searchTerm
    ? filterLearningPaths(learningPaths ?? [], searchTerm)
    : learningPaths;

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
          title="Search Learning Path Name"
          value={searchTerm}
          onChange={handleSearchOnChange}
        />
        <Button
          onClick={() => {
            navigate('/dashboard/learning-paths/create');
          }}
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add New Learning Path
        </Button>
      </div>
      <DataTable type="learning_path" data={filteredLearningPaths ?? []} />
    </div>
  );
};

export default LearningPathsScreen;
