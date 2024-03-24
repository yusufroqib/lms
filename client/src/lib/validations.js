import * as z from "zod";
export const PostsSchema = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(30),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});
export const ReplySchema = z.object({
    reply: z.string().min(10),
});