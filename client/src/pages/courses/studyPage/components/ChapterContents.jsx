import React from 'react'
import { useParams } from 'react-router-dom';
import { CourseProgressButton } from './CourseProgressButton';
import { File } from "lucide-react";
import { Banner } from "@/components/ui/banner";
import { Separator } from "@/components/ui/separator";
import parse from "html-react-parser";


const ChapterContents = ({nextChapterId, chapter, purchase}) => {
    const {courseId} = useParams()
    // const { userId } = auth();
    // if (!userId) {
    //     return redirect("/");
    // }
    // const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase, } = await getChapter({
    //     userId,
    //     chapterId: params.chapterId,
    //     courseId: params.courseId,
    // });
    // if (!chapter || !course) {
    //     return redirect("/");
    // }
    const userProgress = chapter.userProgress
    const attachments = chapter.attachments;
    const isLocked = !chapter.isFree && !purchase;
    // const completeOnEnd = !!purchase && !userProgress?.isCompleted;
    return (<div>
      {userProgress?.isCompleted && (<Banner variant="success" label="You already completed this chapter."/>)}
      {isLocked && (<Banner variant="warning" label="You need to purchase this course to watch this chapter."/>)}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <video className='min-w-full' controls src={chapter.videoUrl}  nextChapterId={nextChapterId} />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            <CourseProgressButton chapterId={chapter._id} courseId={courseId} nextChapterId={nextChapterId} isCompleted={!!userProgress?.isCompleted}/>
          </div>
          <Separator />
          <div className='p-4'>
            {parse(chapter.description)}
            {/* <Markdown value={chapter.description}/> */}
            {/* <Markdown value={chapter.description}/> */}
          </div>
          {!!attachments.length && (<>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (<a href={attachment.url} target="_blank" key={attachment.id} className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                    <File />
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>))}
              </div>
            </>)}
        </div>
      </div>
    </div>);
}

export default ChapterContents