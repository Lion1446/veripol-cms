import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../stores/DashboardStore';
import { ContentTag } from '../models/ContentTag';

interface DataTableProps<T> {
  data: T[];
  type: string;
}

const DataTable = <T extends object>({ data, type }: DataTableProps<T>) => {
  const {
    setBook,
    setCourse,
    setContentTagBooks,
    setLearnigPath,
    setJobRole,
    setSkill
  } = useDashboardStore((state) => ({
    setBook: state.setBook,
    setCourse: state.setCourse,
    setLearnigPath: state.setLearningPath,
    setJobRole: state.setJobRole,
    setSkill: state.setSkill,
    setContentTagBooks: state.setContentTagBooks
  }));

  const navigate = useNavigate();

  const handleRowClick = async (params: GridRowParams) => {
    const { row } = params;
    const contentTagInstance = new ContentTag({
      id: row.id,
      name: row.name,
      type: row.type,
      description: row.description,
      author_id: row.author_id,
      books: []
    });

    await contentTagInstance.getBooksById();
    setContentTagBooks(contentTagInstance.books);

    switch (type) {
      case 'book':
        setBook(row);
        navigate('/dashboard/books/book');
        break;
      case 'course':
        setCourse(row);
        navigate('/dashboard/courses/course');
        break;
      case 'learning_path':
        setLearnigPath(row);
        navigate('/dashboard/learning-paths/learning-path');
        break;
      case 'job_role':
        setJobRole(row);
        navigate('/dashboard/job-roles/job-role');
        break;
      case 'skill':
        setSkill(row);
        navigate('/dashboard/skills/skill');
        break;
      default:
        break;
    }
  };

  const filteredData = data.map((row) =>
    Object.entries(row).reduce(
      (acc, [key, value]) => {
        if (
          value !== undefined &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    )
  );

  const columns: GridColDef[] = Object.keys(filteredData[0] || {}).map(
    (key) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      width: 150,
      flex: 1
    })
  );

  const rows = filteredData.map((row, index) => ({ id: index, ...row }));

  return (
    <div style={{ height: '70vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        pageSizeOptions={[10, 50, 100]}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default DataTable;
