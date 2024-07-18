import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
const TUTOR_SHARE = import.meta.env.VITE_TUTOR_SHARE;

export const columns = [
	{
		accessorKey: "courseTitle",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const title = row.getValue("courseTitle");

			return <p className="ml-4">{title}</p>;
		},
	},
	{
		accessorKey: "amount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Course Value
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("amount") || "0");
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(price);
			return <div className="ml-4">{price ? formatted : "Free"}</div>;
		},
	},
	{
		accessorKey: "earned_amount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Earned
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("amount") || "0");
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(price * Number(TUTOR_SHARE));
			return <div className="ml-4">{price ? formatted : "Free"}</div>;
		},
	},
	{
		accessorKey: "studentName",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Student
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const studentName = row.getValue("studentName");
			return <p className="ml-4">{studentName}</p>;
		},
	},
	{
		accessorKey: "date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			// const { id } = row.original;
			const date = row.getValue("date");

			return <p className="ml-4">{format(new Date(date), "MMMM d, yyyy")}</p>;
		},
	},
];
