import type { NextRequest } from "next/server";

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: NextRequest) {
  const resJson: any = await req.json();

  const param: any = {
    part: "snippet,replies",
    videoId: resJson.videoId,
    pageToken: resJson.pageToken,
    order: resJson.order,
    maxResults: resJson.maxResults,
    searchTerms: resJson.searchTerms,
    textFormat: "plainText",
    key: process.env.GOOGLE_API_KEY,
  };
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?${new URLSearchParams(
    param
  )}`;

  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();

  return Response.json({ data });
}
