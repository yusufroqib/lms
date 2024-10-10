import React, { useMemo } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	flexRender,
} from "@tanstack/react-table";
import {
	ArrowUpDown,
	CreditCard,
	Bitcoin,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const TransactionsTable = ({ data }) => {
	const columns = useMemo(
		() => [
			{
				accessorKey: "type",
				header: "Type",
				cell: ({ row }) => (
					<div className="capitalize">{row.getValue("type")}</div>
				),
			},
			{
				accessorKey: "paymentMethod",
				header: "Method",
				cell: ({ row }) => (
					<div className="flex items-center">
						{row.getValue("paymentMethod") === "card" ? (
							<CreditCard className="mr-2 h-4 w-4" />
						) : (
							<Bitcoin className="mr-2 h-4 w-4" />
						)}
						<span className="capitalize">{row.getValue("paymentMethod")}</span>
					</div>
				),
			},
			{
				accessorKey: "amount",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Amount
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ row }) => (
					<div className="text-left ml-4">${row.getValue("amount")}</div>
				),
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => (
					<div className="capitalize">{row.getValue("status")}</div>
				),
			},
			{
				accessorKey: "transactionId",
				header: "Transaction ID",
				cell: ({ row }) => {
					const stripeTransactionId = row.original.stripeTransactionId;
					const txHash = row.original.txHash;
					return <div>{stripeTransactionId || txHash}</div>;
				},
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Date
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ row }) => (
					<div className="ml-4">
						{new Date(row.getValue("createdAt")).toLocaleString()}
					</div>
				),
			},
		],
		[]
	);
	const [sorting, setSorting] = React.useState([
		{ id: "createdAt", desc: true },
	]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data: data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			pagination,
		},
	});

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Transactions</h1>

			<div className="flex space-x-2 mb-4">
				<Input
					placeholder="Filter by type..."
					value={table.getColumn("type")?.getFilterValue() ?? ""}
					onChange={(event) =>
						table.getColumn("type")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<Select
					onValueChange={(value) =>
						table
							.getColumn("paymentMethod")
							?.setFilterValue(value === "all" ? "" : value)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Payment Method" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="card">Card</SelectItem>
						<SelectItem value="crypto">Crypto</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="grid px-2 py-4">
				<div className="flex gap-3">
					<div className="flex-1 max-xs:text-xs text-sm text-muted-foreground">
						Showing{" "}
						{table.getState().pagination.pageIndex *
							table.getState().pagination.pageSize +
							1}{" "}
						to{" "}
						{Math.min(
							(table.getState().pagination.pageIndex + 1) *
								table.getState().pagination.pageSize,
							table.getFilteredRowModel().rows.length
						)}{" "}
						of {table.getFilteredRowModel().rows.length} entries
					</div>
					<div className="flex items-center space-x-2">
						<p className="max-xs:text-xs text-sm font-medium">Rows per page</p>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex justify-end mt-4  space-x-6 lg:space-x-8">
					<div className="flex w-[100px] items-center justify-center max-xs:text-xs text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronLeft className="h-4 w-4" />
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronRight className="h-4 w-4" />
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransactionsTable;
