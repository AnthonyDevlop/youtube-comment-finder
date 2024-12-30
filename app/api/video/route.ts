import type { NextRequest } from "next/server";

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    
  const resJson: any = await req.json();

  const param: any = {
    part: "snippet,statistics",
    id: resJson.id,
    key: process.env.GOOGLE_API_KEY,
  };

  const url = `https://www.googleapis.com/youtube/v3/videos?${new URLSearchParams(
    param
  )}`;

  const res = await fetch(url, {
    method: "GET",
  });

  const respond = await res.json();

  // @ts-ignore
  const data = respond?.items?.[0] ?? {};

  return Response.json({ data });

  } catch (error) {
    return Response.json({ data: {} });
  }
}
