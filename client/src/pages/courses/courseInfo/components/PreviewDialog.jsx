import React from "react";
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
	Avatar,
	IconButton,
	Typography,
	Card,
} from "@material-tailwind/react";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";
import parse from "html-react-parser";

const PreviewDialog = ({
	open,
	chapter,
	setChapter,
	setOpen,
	setClickedId,
}) => {
	console.log(chapter.description);
	const handleOpen = () => {
		setOpen((cur) => !cur);
		if (open) {
			setClickedId(null);
			setChapter(null);
		}
	};

	return (
		// <div>
			<Dialog
				size="lg"
                // className="maxH-screen"
				open={open}
				handler={handleOpen}
			>
				{/* <DialogHeader className="justify-between">
					<div className="flex items-center gap-3">
						<Avatar
							size="sm"
							variant="circular"
							alt="tania andrew"
							src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
						/>
						<div className="-mt-px flex flex-col">
							<Typography
								variant="small"
								color="blue-gray"
								className="font-medium"
							>
								Tania Andrew 
							</Typography>
							<Typography
								variant="small"
								color="gray"
								className="text-xs font-normal"
							>
								@emmaroberts
							</Typography>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<IconButton
							variant="text"
							size="sm"
							color={"blue-gray"}
							// onClick={handleIsFavorite}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="h-5 w-5"
							>
								<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
							</svg>
						</IconButton>
						<Button color="gray" size="sm">
							Free Download
						</Button>
					</div>
				</DialogHeader> */}
				<DialogBody className=" overflow-scroll max-h-[42rem] ">
					<div className="flex flex-col  mx-auto">
						<div className="p-4">
							<video className='min-w-full' controls src={chapter.videoUrl} />
						</div>
						<div>
							<div className="p-4 flex flex-col md:flex-row items-center justify-between">
								<h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
								{/* {purchase ? (<CourseProgressButton chapterId={params.chapterId} courseId={params.courseId} nextChapterId={nextChapter?.id} isCompleted={!!userProgress?.isCompleted}/>) : (<CourseEnrollButton courseId={params.courseId} price={course.price}/>)} */}
							</div>
							<Separator />
							<div className="mt-5">{parse(chapter.description)} </div>
							{/* {!!chapter.attachments.length && (
								<>
									<Separator />
									<div className="p-4">
										<div>
											<h3 className="font-bold text-lg">Chapter attachments</h3>
										</div>
										{chapter.attachments.map((attachment) => (
											<a
												href={attachment.url}
												target="_blank"
												key={attachment._id}
												className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
											>
												<File />
												<p className="line-clamp-1">{attachment.name}</p>
											</a>
										))}
									</div>
								</>
							)} */}
						</div>
					</div>
				</DialogBody>
				{/* <DialogFooter className="justify-between">
					<div className="flex items-center gap-16">
						<div>
							<Typography variant="small" color="gray" className="font-normal">
								Views
							</Typography>
							<Typography color="blue-gray" className="font-medium">
								44,082,044
							</Typography>
						</div>
						<div>
							<Typography variant="small" color="gray" className="font-normal">
								Downloads
							</Typography>
							<Typography color="blue-gray" className="font-medium">
								553,031
							</Typography>
						</div>
					</div>
					<Button
						size="sm"
						variant="outlined"
						color="blue-gray"
						className="mr-5 flex items-center"
					>
						Share
					</Button>
				</DialogFooter> */}
			</Dialog>
		// </div>
	);
};

export default PreviewDialog;
