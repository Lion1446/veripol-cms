import React, { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Book } from '../models/Book'; // Make sure this is your API service for book creation

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficultyLevel: z
    .number()
    .int()
    .min(100, 'Minimum difficulty level is 100')
    .max(300, 'Maximum difficulty level is 300'),
  status: z.enum(['Published', 'Unpublished'])
});

type BookFormValues = z.infer<typeof bookSchema>;

const BooksCreateScreen = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUserStore((state) => ({
    user: state.user
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema)
  });

  const title = watch('title', '');
  const description = watch('description', '');

  const createBook = async (newBook: Book) => {
    return newBook.create();
  };

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      navigate(-1);
    }
  });

  const onSubmit: SubmitHandler<BookFormValues> = async (data) => {
    const newBook = new Book({
      id: uuidv4(),
      title: data.title,
      description: data.description,
      difficultyLevel: data.difficultyLevel,
      authorID: user?.id ?? '',
      isPublished: data.status === 'Published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    mutation.mutate(newBook); // Trigger the mutation
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
            Create New Book
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
                label="Book Title"
                variant="outlined"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                style={{ flex: 1, backgroundColor: 'white' }}
              />
              <TextField
                label="Book Description"
                variant="outlined"
                multiline
                rows={15}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                style={{ flex: 1, backgroundColor: 'white' }}
              />
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <FormControl style={{ flex: 1 }}>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    defaultValue=""
                    variant="outlined"
                    {...register('difficultyLevel')}
                    error={!!errors.difficultyLevel}
                    style={{ minWidth: 200, backgroundColor: 'white' }}
                  >
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={200}>200</MenuItem>
                    <MenuItem value={300}>300</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ flex: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    defaultValue=""
                    variant="outlined"
                    {...register('status')}
                    error={!!errors.status}
                    style={{ minWidth: 200, backgroundColor: 'white' }}
                  >
                    <MenuItem value={'Published'}>Published</MenuItem>
                    <MenuItem value={'Unpublished'}>Unpublished</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ marginTop: '20px', alignSelf: 'flex-end' }}>
                <Button type="submit" variant="contained" color="primary">
                  {mutation.isPending ? (
                    <Typography>Creating</Typography>
                  ) : (
                    <Typography>Create</Typography>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <Typography fontWeight={500} variant="h4" color={'#7D7D7D'}>
            Preview Content
          </Typography>
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '30px'
            }}
          >
            <Typography fontWeight={500} variant="h4">
              {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksCreateScreen;
