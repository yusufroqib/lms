import { useGetMyDetailsQuery } from "@/features/users/usersApiSlice";
import TransactionsTable from "./components/TransactionsTable";
import { Loader2 } from "lucide-react";

function Transactions() {
	const { data, isLoading, isSuccess, isFetching, error, isError } =
		useGetMyDetailsQuery("myDetails");
	if (isLoading)
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />
			</div>
		);

	const myDetails = Object.values(data?.entities ?? {})[0];

	console.log(myDetails, isLoading, isSuccess);
	return (
		<div className="container mx-auto">
			<TransactionsTable data={myDetails?.transactions} />
		</div>
	);
}

export default Transactions;
