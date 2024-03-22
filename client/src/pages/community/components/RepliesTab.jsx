import { getUserReplies } from "@/lib/actions/user.action";
// import { Link, useSearchParams } from "react-router-dom";
import ReplyCard from "../cards/ReplyCard";
import Pagination from "./Pagination";
const RepliesTab = async ({ searchParams, userId }) => {
  // const [searchParams, setSearchParams] = useSearchParams();

    const result = await getUserReplies({

        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });
    console.log(result.replies);
    return (<>
      {result.replies.map((item) => (<ReplyCard key={item._id}  _id={item._id} post={item.post} author={item.author} upvotes={item.upvotes.length} createdAt={item.createdAt}/>))}
      <div className="mt-10">
        <Pagination pageNumber={searchParams?.page ? +searchParams.page : 1} isNext={result.isNextReply}/>
      </div>
    </>);
};
export default RepliesTab;
