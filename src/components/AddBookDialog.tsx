import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Book } from '../models/Book';
import { SelectChangeEvent } from '@mui/material/Select';

interface BookDialogProps {
  books: Book[];
  open: boolean;
  onClose: () => void;
  onAddBook: (book: Book) => void;
}

const AddBookDialog: React.FC<BookDialogProps> = ({
  books,
  open,
  onClose,
  onAddBook
}) => {
  const [selectedBookId, setSelectedBookId] = useState<number | string>('');

  const handleBookChange = (event: SelectChangeEvent<number | string>) => {
    setSelectedBookId(event.target.value as number);
  };

  const handleAddBook = () => {
    const selectedBook = books.find((book) => book.id === selectedBookId);
    if (selectedBook) {
      onAddBook(selectedBook);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Input Book Name</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="book-select-label">Book</InputLabel>
          <Select
            labelId="book-select-label"
            value={selectedBookId}
            onChange={handleBookChange}
          >
            {books.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddBook} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBookDialog;
