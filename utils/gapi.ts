"use server";
import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";
import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY,
});

export async function search(q: string, pageToken: string) {
  const res = await youtube.search.list({
    part: ["snippet"],
    q,
    maxResults: 50,
    pageToken,
  });
  return { data: res.data };
}

export async function video(id: string): Promise<youtube_v3.Schema$Video> {
  const res = await youtube.videos.list({
    part: ["snippet", "statistics"],
    id: [id],
  });
  return res?.data?.items?.[0] ?? {};
}

export async function comments(
  videoId: string,
  searchTerms = "",
  pageToken = "",
  order = "time",
  maxResults = 20,
) {
  console.log(searchTerms, pageToken);
  const res = await youtube.commentThreads.list({
    part: ["snippet", "replies"],
    pageToken,
    videoId,
    maxResults,
    order,
    // "order": "relevance / time/like asc'、'desc",
    textFormat: "plainText",
    searchTerms,
  });
  return res?.data;
}
