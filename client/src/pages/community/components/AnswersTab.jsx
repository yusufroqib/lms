import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";
const AnswersTab = async ({ searchParams, userId, clerkId }) => {
    const result = await getUserAnswers({
        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });
    console.log(result.answers);
    return (<>
      {result.answers.map((item) => (<AnswerCard key={item._id} clerkId={clerkId} _id={item._id} question={item.question} author={item.author} upvotes={item.upvotes.length} createdAt={item.createdAt}/>))}
      <div className="mt-10">
        <Pagination pageNumber={searchParams?.page ? +searchParams.page : 1} isNext={result.isNextAnswer}/>
      </div>
    </>);
};
export default AnswersTab;
