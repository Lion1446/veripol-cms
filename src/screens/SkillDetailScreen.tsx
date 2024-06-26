import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import BookDialog from '../components/AddBookDialog';
import { Book } from '../models/Book';
import { ContentTag } from '../models/ContentTag';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useDashboardStore } from '../stores/DashboardStore';
import { useUserStore } from '../stores/UserStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const contenttagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required')
});

type ContenttagFormValues = z.infer<typeof contenttagSchema>;

interface BookWithPosition {
  book: Book;
  position: number;
}

const SkillDetailScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { books, skill, contentTagBooks } = useDashboardStore((state) => ({
    books: state.books,
    skill: state!.skill,
    contentTagBooks: state.contentTagBooks
  }));
  const [selectedBooks, setSelectedBooks] = useState<BookWithPosition[]>(
    contentTagBooks!
  );

  const { user } = useUserStore((state) => ({
    user: state.user
  }));

  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ContenttagFormValues>({
    resolver: zodResolver(contenttagSchema)
  });

  const deleteSkill = async () => {
    return new ContentTag(skill!).delete();
  };

  const mutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      navigate(-1);
    }
  });

  const onSubmit: SubmitHandler<ContenttagFormValues> = async (data) => {
    setCreating(true);
    const newSkill = new ContentTag({
      id: skill!.id,
      name: data.name,
      description: data.description,
      created_at: skill!.created_at,
      updated_at: new Date().toISOString(),
      type: 'skill',
      author_id: user!.id,
      books: selectedBooks
    });
    const result = await newSkill.update();
    setCreating(false);
    if (result) {
      navigate(-1);
    }
  };

  const handleAddBook = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBooks((prevBooks) => [
      ...prevBooks,
      { book, position: prevBooks.length + 1 }
    ]);
    setDialogOpen(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedBooks = Array.from(selectedBooks);
    const [movedBook] = reorderedBooks.splice(result.source.index, 1);
    reorderedBooks.splice(result.destination.index, 0, movedBook);

    setSelectedBooks(
      reorderedBooks.map((book, index) => ({
        ...book,
        position: index + 1
      }))
    );
  };

  const handleDelete = async () => {
    setDeleting(true);
    mutation.mutate();
    setDeleting(false);
  };

  return (
    <div className="content-section">
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            flex: 1,
            backgroundColor: '#F2F4F4',
            padding: '20px',
            gap: '20px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            style={{ alignSelf: 'flex-start' }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Typography fontWeight={500} variant="h4">
            About this Skill
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: '20px'
              }}
            >
              <TextField
                label="Skill Name"
                variant="outlined"
                {...register('name')}
                defaultValue={skill!.name}
                error={!!errors.name}
                helperText={errors.name?.message}
                style={{ flex: 1, backgroundColor: 'white' }}
              />
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={15}
                {...register('description')}
                defaultValue={skill!.description}
                error={!!errors.description}
                helperText={errors.description?.message}
                style={{ flex: 1, backgroundColor: 'white' }}
              />
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#cc0000',
                    color: 'white',
                    '&:hover': { backgroundColor: '#a30000' }
                  }}
                  onClick={handleDelete}
                >
                  {deleting ? (
                    <Typography>Deleting</Typography>
                  ) : (
                    <Typography>Delete</Typography>
                  )}
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {creating ? (
                    <Typography>Updating</Typography>
                  ) : (
                    <Typography>Update</Typography>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <Button
            onClick={handleAddBook}
            variant="contained"
            color="primary"
            style={{ width: '100%' }}
          >
            Add Book
          </Button>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="books">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ marginTop: '20px' }}
                >
                  {selectedBooks.map((bookWithPosition, index) => (
                    <Draggable
                      key={bookWithPosition.book.id}
                      draggableId={bookWithPosition.book.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            marginBottom: '10px',
                            ...provided.draggableProps.style
                          }}
                        >
                          <Card>
                            <CardContent
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                              }}
                            >
                              <DragIndicatorIcon />
                              <Typography variant="h6">
                                {bookWithPosition.book.title}
                              </Typography>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <BookDialog
        books={books ?? []}
        open={dialogOpen}
        onClose={handleDialogClose}
        onAddBook={handleBookSelect}
      />
    </div>
  );
};

export default SkillDetailScreen;
