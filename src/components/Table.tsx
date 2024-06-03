import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { dashboardStore } from "../stores/DashboardStore";
import { ContentTag } from "../models/ContentTag";

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
		setSkill,
	} = dashboardStore((state) => ({
		setBook: state.setBook,
		setCourse: state.setCourse,
		setLearnigPath: state.setLearningPath,
		setJobRole: state.setJobRole,
		setSkill: state.setSkill,
		setContentTagBooks: state.setContentTagBooks,
	}));
	const navigate = useNavigate();
	const handleRowClick = async (params: GridRowParams) => {
		if (type == "book") {
			setBook(params.row);
			navigate("/dashboard/books/book");
		} else if (type == "course") {
			const courseObject = params.row;
			setCourse(courseObject);
			const contentTagInstance = new ContentTag({
				id: courseObject.id,
				name: courseObject.name,
				type: courseObject.type,
				description: courseObject.description,
				author_id: courseObject.author_id,
				books: [], // Add books if available
			});
			await contentTagInstance.getBooksById();
			setContentTagBooks(contentTagInstance.books);
			navigate("/dashboard/courses/course");
		} else if (type == "learning_path") {
			const learningPathObject = params.row;
			setLearnigPath(learningPathObject);
			const contentTagInstance = new ContentTag({
				id: learningPathObject.id,
				name: learningPathObject.name,
				type: learningPathObject.type,
				description: learningPathObject.description,
				author_id: learningPathObject.author_id,
				books: [], // Add books if available
			});
			await contentTagInstance.getBooksById();
			setContentTagBooks(contentTagInstance.books);
			navigate("/dashboard/learning-paths/learning-path");
		} else if (type == "job_role") {
			const jobRoleObject = params.row;
			setJobRole(jobRoleObject);
			const contentTagInstance = new ContentTag({
				id: jobRoleObject.id,
				name: jobRoleObject.name,
				type: jobRoleObject.type,
				description: jobRoleObject.description,
				author_id: jobRoleObject.author_id,
				books: [], // Add books if available
			});
			await contentTagInstance.getBooksById();
			setContentTagBooks(contentTagInstance.books);
			navigate("/dashboard/job-roles/job-role");
		} else if (type == "skill") {
			const skillObject = params.row;
			setSkill(skillObject);
			const contentTagInstance = new ContentTag({
				id: skillObject.id,
				name: skillObject.name,
				type: skillObject.type,
				description: skillObject.description,
				author_id: skillObject.author_id,
				books: [], // Add books if available
			});
			await contentTagInstance.getBooksById();
			setContentTagBooks(contentTagInstance.books);
			navigate("/dashboard/skills/skill");
		}
	};

	// Filter out keys with undefined values
	const filteredData = data.map((row) =>
		Object.entries(row).reduce(
			(acc, [key, value]) => {
				if (
					(value !== undefined && !Array.isArray(value)) ||
					value.length > 0
				) {
					acc[key] = value;
				}
				return acc;
			},
			{} as Record<string, any>
		)
	);

	// Generate columns dynamically based on filtered keys in data
	const columns: GridColDef[] = Object.keys(filteredData[0] || {}).map(
		(key) => ({
			field: key,
			headerName: key.charAt(0).toUpperCase() + key.slice(1),
			width: 150,
			flex: 1,
		})
	);

	// Create rows with an 'id' field required by DataGrid
	const rows = filteredData.map((row, index) => ({ id: index, ...row }));

	return (
		<div style={{ height: "70vh", width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 10 },
					},
				}}
				pageSizeOptions={[10, 50, 100]}
				onRowClick={handleRowClick}
			/>
		</div>
	);
};

export default DataTable;
