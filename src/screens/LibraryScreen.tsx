import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../components/SearchBar';
import { useState, ChangeEvent, ReactElement } from 'react';
import { Book } from '../models/Book';
import { useDashboardStore } from '../stores/DashboardStore';
import './style.css';
import DataTable from '../components/Table';
import { useNavigate } from 'react-router-dom';

const LibraryScreen = (): ReactElement => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { books } = useDashboardStore((state) => ({
    books: state.books
  }));

  const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterBooks = (data: Book[], searchTerm: string) => {
    return data.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredBooks = searchTerm
    ? filterBooks(books ?? [], searchTerm)
    : books;

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
          title="Search Book Name"
          value={searchTerm}
          onChange={handleSearchOnChange}
        />
        <Button
          onClick={() => {
            navigate('/dashboard/books/create');
          }}
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add New Book
        </Button>
      </div>
      <DataTable type="book" data={filteredBooks ?? []} />
    </div>
  );
};

export default LibraryScreen;
