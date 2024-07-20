import React, { useEffect, useState } from "react";
import UserCard from "../../components/cards/UserCard";
import Filter from "../../components/Filter";
import Pagination from "../../components/Pagination";
import LocalSearchBar from "../../components/search/LocalSearchBar";
import { UserFilters } from "@/lib/filters";
import qs from "query-string";
// import { getAllUsers } from "@/lib/actions/user.action";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom"; // Adjusted for React Router
import { useGetAllUsersQuery } from "@/features/users/usersApiSlice";
import Loading from "./components/Loading";

const Users = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	// const { username, isTutor, isAdmin, _id: userId } = useAuth();
	// const [result, setResult] = useState({ posts: [], isNext: false });
	const filter_search = searchParams.get("filter");
	const q_search = searchParams.get("q");
	const page_search = searchParams.get("page");
	const location = useLocation();
	const [stringifyQuery, setStringifyQuery] = useState();

	const {
		data: result,
		isLoading,
		isSuccess,
		error,
		isError,
	} = useGetAllUsersQuery({ searchParams: stringifyQuery });

	useEffect(() => {
		// const fetchUsers =  () => {
		const url = qs.stringifyUrl(
			{
				url: location.pathname,
				query: {
					searchQuery: q_search,
					filter: filter_search,
					page: page_search ? Number(page_search) : 1,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);

		const queryString = url.split("?")[1];
		setStringifyQuery(queryString);
		// }
		// };

		// fetchUsers();
	}, [searchParams]);

	if (isLoading) return <Loading />;

	if ((isSuccess && !result) || isError) {
		return <Navigate to="/community/feeds" />;
	}

	if (result) {
		return (
			<>
				<h1 className="h1-bold text-dark100_light900">All Users</h1>

				<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
					<LocalSearchBar
						route="/community"
						iconPosition="left"
						imgSrc="/assets/icons/search.svg"
						placeholder="Search for amazing minds"
						otherClasses="flex-1"
					/>

					<Filter
						filters={UserFilters}
						otherClasses="min-h-[56px] sm:min-w-[170px]"
					/>
				</div>

				<section className="mt-12 flex flex-wrap gap-4 justify-center">
					{result.users.length > 0 ? (
						result.users.map((user) => <UserCard key={user._id} user={user} />)
					) : (
						<div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
							<p>No users yet</p>
							<Link to="/sign-up" className="mt-2 font-bold text-accent-blue">
								Join to be the first!
							</Link>
						</div>
					)}
				</section>
				<div className="mt-10">
					<Pagination
						pageNumber={page_search ? +page_search : 1}
						isNext={result.isNext}
					/>
				</div>
			</>
		);
	}
};

export default Users;
