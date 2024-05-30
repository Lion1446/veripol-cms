import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	TextField,
	Button,
	Divider,
	Typography,
	CircularProgress,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import { User } from "../models/User"; // Ensure the import path is correct
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/UserStore";

const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginScreen = () => {
	const { setUser } = useUserStore((state) => ({
		setUser: state.setUser,
	}));
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
		try {
			setLoading(true);
			setErrorMessage(null); // Clear previous error messages
			const user = await User.login(data.email, data.password);
			if (user) {
				setUser(user); // Set the user data in Zustand
				navigate("/dashboard/books");
			} else {
				setErrorMessage("Invalid credentials");
			}
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage("Error during login: " + error.message);
			} else {
				setErrorMessage("An unexpected error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleShowPasswordChange = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				width: "100vw",
			}}
		>
			<img src='/veripol-logo.png' alt='Veripol logo' />
			<Typography variant='h2' style={{ margin: "20px 0px" }}>
				Veripol CMS
			</Typography>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "10px",
					justifyContent: "center",
				}}
			>
				<Divider style={{ width: "100px" }} />
				<Typography>Sign in using email</Typography>
				<Divider style={{ width: "100px" }} />
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					marginTop: "20px",
					width: "100%", // Maximize width
					maxWidth: "400px", // Adjust the maximum width as needed
				}}
			>
				<TextField
					label='Email'
					variant='outlined'
					{...register("email")}
					error={!!errors.email}
					helperText={errors.email ? errors.email.message : ""}
				/>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<TextField
						label='Password'
						type={showPassword ? "text" : "password"}
						variant='outlined'
						{...register("password")}
						error={!!errors.password}
						helperText={errors.password ? errors.password.message : ""}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={showPassword}
								onChange={handleShowPasswordChange}
							/>
						}
						label='Show Password'
					/>
				</div>
				{errorMessage && <Typography color='error'>{errorMessage}</Typography>}
				<Button type='submit' variant='contained' color='primary' size='large'>
					{loading ? (
						<div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
							<CircularProgress
								style={{ color: "white", height: "20px", width: "20px" }}
							/>
							<Typography variant='body1'>Logging In</Typography>
						</div>
					) : (
						<Typography variant='body1'>Login</Typography>
					)}
				</Button>
			</form>
		</div>
	);
};

export default LoginScreen;
