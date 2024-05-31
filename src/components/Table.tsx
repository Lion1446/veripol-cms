import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DataTableProps<T> {
	data: T[];
}

const DataTable = <T extends object>({ data }: DataTableProps<T>) => {
	// Filter out keys with undefined values
	const filteredData = data.map((row) =>
		Object.entries(row).reduce(
			(acc, [key, value]) => {
				if (value !== undefined) {
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
			/>
		</div>
	);
};

export default DataTable;
