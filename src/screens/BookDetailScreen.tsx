import React, { useState, useEffect } from "react";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/UserStore";
import { dashboardStore } from "../stores/DashboardStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Book } from "../models/Book";

const bookSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	difficultyLevel: z
		.number()
		.int()
		.min(100, "Minimum difficulty level is 100")
		.max(300, "Maximum difficulty level is 300"),
	status: z.enum(["Published", "Unpublished"]),
});

type BookFormValues = z.infer<typeof bookSchema>;

const BookDetailScreen = () => {
	const navigate = useNavigate();
	const { user } = useUserStore((state) => ({
		user: state.user,
	}));
	const { book } = dashboardStore((state) => ({
		book: state.book,
	}));
	const [updating, setUpdating] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<BookFormValues>({
		resolver: zodResolver(bookSchema),
		defaultValues: {
			title: book?.title || "",
			description: book?.description || "",
			difficultyLevel: book?.difficultyLevel || 100,
			status: book?.isPublished ? "Published" : "Unpublished",
		},
	});

	const title = watch("title", book?.title || "");
	const description = watch("description", book?.description || "");

	const onSubmit = async (data: BookFormValues) => {
		setUpdating(true);
		const updatedBook = new Book({
			id: book!.id,
			title: data.title,
			description: data.description,
			difficultyLevel: data.difficultyLevel,
			authorID: user?.id ?? "",
			isPublished: data.status === "Published",
			created_at: book!.created_at,
			updated_at: new Date().toISOString(),
		});
		const result = await updatedBook.update();
		setUpdating(false);
		if (result) {
			navigate(-1);
		}
	};

	const handleDelete = async () => {
		setDeleting(true);
		const result = await new Book(book!).delete();
		setDeleting(false);
		if (result) {
			navigate(-1);
		}
	};

	const formControlStyles = {
		flex: 1,
		backgroundColor: "white",
	};

	return (
		<div className='content-section'>
			<div style={{ display: "flex", width: "100%", height: "100%" }}>
				<div
					style={{
						flex: 1,
						backgroundColor: "#F2F4F4",
						padding: "20px",
						gap: "20px",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Button
						startIcon={<ArrowBackIcon />}
						style={{ alignSelf: "flex-start" }}
						onClick={() => navigate(-1)}
					>
						Back
					</Button>
					<Typography fontWeight={500} variant='h4'>
						About this Book
					</Typography>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								height: "100%",
								gap: "20px",
							}}
						>
							<TextField
								label='Book Title'
								variant='outlined'
								{...register("title")}
								error={!!errors.title}
								helperText={errors.title?.message}
								style={formControlStyles}
							/>
							<TextField
								label='Book Description'
								variant='outlined'
								multiline
								rows={15}
								{...register("description")}
								error={!!errors.description}
								helperText={errors.description?.message}
								style={formControlStyles}
							/>
							<div
								style={{
									display: "flex",
									gap: "20px",
									marginTop: "20px",
								}}
							>
								<FormControl style={formControlStyles}>
									<InputLabel>Difficulty Level</InputLabel>
									<Select
										defaultValue={book?.difficultyLevel || ""}
										variant='outlined'
										{...register("difficultyLevel")}
										error={!!errors.difficultyLevel}
										style={{ minWidth: 200, backgroundColor: "white" }}
									>
										<MenuItem value={100}>100</MenuItem>
										<MenuItem value={200}>200</MenuItem>
										<MenuItem value={300}>300</MenuItem>
									</Select>
								</FormControl>
								<FormControl style={formControlStyles}>
									<InputLabel>Status</InputLabel>
									<Select
										defaultValue={
											book?.isPublished ? "Published" : "Unpublished"
										}
										variant='outlined'
										{...register("status")}
										error={!!errors.status}
										style={{ minWidth: 200, backgroundColor: "white" }}
									>
										<MenuItem value={"Published"}>Published</MenuItem>
										<MenuItem value={"Unpublished"}>Unpublished</MenuItem>
									</Select>
								</FormControl>
							</div>
							<div
								style={{
									marginTop: "20px",
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<Button
									variant='contained'
									sx={{
										backgroundColor: "#cc0000",
										color: "white",
										"&:hover": { backgroundColor: "#a30000" },
									}}
									onClick={handleDelete}
								>
									{deleting ? (
										<Typography>Deleting</Typography>
									) : (
										<Typography>Delete</Typography>
									)}
								</Button>
								<Button type='submit' variant='contained' color='primary'>
									{updating ? (
										<Typography>Updating</Typography>
									) : (
										<Typography>Update</Typography>
									)}
								</Button>
							</div>
						</div>
					</form>
				</div>
				<div style={{ flex: 1, padding: "20px" }}>
					<Typography fontWeight={500} variant='h4' color={"#7D7D7D"}>
						Preview Content
					</Typography>
					<div
						style={{
							marginTop: "20px",
							display: "flex",
							flexDirection: "column",
							gap: "30px",
						}}
					>
						<Typography fontWeight={500} variant='h4'>
							{title}
						</Typography>
						<Typography variant='body1'>{description}</Typography>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookDetailScreen;
