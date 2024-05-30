import { BaseModel, IBaseModel } from "./BaseModel";
import { supabase } from "../supabaseClient";
import bcrypt from "bcryptjs";

export interface IUser extends IBaseModel {
	email: string;
	password: string;
}

export class User extends BaseModel implements IUser {
	email: string;
	password: string;

	constructor(data: IUser) {
		super(data);
		this.email = data.email;
		this.password = data.password;
	}

	static fromJson(json: Record<string, any>): User {
		return new User({
			...BaseModel.fromJson(json),
			email: json.email,
			password: json.password,
		});
	}

	toJson(): Record<string, any> {
		return {
			...super.toJson(),
			email: this.email,
			password: this.password,
		};
	}

	async create(): Promise<boolean> {
		try {
			// Hash the password before saving to the database
			const hashedPassword = await bcrypt.hash(this.password, 10);
			const { error } = await supabase.from("users").insert([
				{
					...this.toJson(),
					password: hashedPassword,
				},
			]);

			if (error) {
				console.error("Error saving user:", error);
				return false;
			}
			return true;
		} catch (error) {
			console.error("Error hashing password:", error);
			return false;
		}
	}

	static async fetchByEmail(email: string): Promise<User | null> {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("email", email)
			.single();

		if (error || !data) {
			console.error("Error fetching user:", error);
			return null;
		}

		return User.fromJson(data);
	}

	static async login(email: string, password: string): Promise<User | null> {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error || !data) {
			console.error("Error signing in:", error);
			return null;
		}

		console.log(data);

		return User.fromJson(data.user);
	}
}
