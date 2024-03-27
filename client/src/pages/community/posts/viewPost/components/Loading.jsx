import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
	return (
		<>
			<div className="flex-start w-full flex-col">
				<div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
					<div className="flex items-center justify-start gap-1">
						<Skeleton className="rounded-full w-7 h-7" />
						<Skeleton className="w-40 h-5" />
					</div>
					<div className="flex justify-end">
						<Skeleton className={"h-5 w-40"} />
					</div>
				</div>
				<div className="flex w-full flex-col">
					<Skeleton className="h-10 mt-3 w-90 text-left" />
					<Skeleton className="h-3 mt-2 w-[450px]" />
					<Skeleton className="h-35 mt-2 w-full" />
					<div className="flex gap-2">
						<Skeleton className="h-10 mt-2 w-20" />
						<Skeleton className="h-10 mt-2 w-20" />
					</div>
					<div className="flex mt-5 justify-between">
						<Skeleton className="h-10 mt-5 w-22" />
						<Skeleton className="h-10 mt-5 w-22" />
					</div>
					<Skeleton className="h-1 mt-2 w-full" />
					<Skeleton className="h-35 mt-4 w-full" />
					<Skeleton className="h-1 mt-10 w-full" />
					<Skeleton className="h-35 mt-4 w-full" />
					<Skeleton className="h-1 mt-10 w-full" />
					<Skeleton className="h-35 mt-4 w-full" />
					<Skeleton className="h-1 mt-10 w-full" />
					<Skeleton className="h-35 mt-4 w-full" />
				</div>
			</div>
		
		</>
	);
};

export default Loading;
