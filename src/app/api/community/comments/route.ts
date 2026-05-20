import { NextRequest } from "next/server";
import { getComments, getBoardComments } from "@/lib/queries/community";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const postId = parseInt(searchParams.get("postId") ?? "0");
  const page = parseInt(searchParams.get("page") ?? "1");
  const type = searchParams.get("type");

  if (!postId) return Response.json([]);

  const comments = type === "board"
    ? await getBoardComments(postId, page)
    : await getComments(postId, page);

  return Response.json(comments);
}
