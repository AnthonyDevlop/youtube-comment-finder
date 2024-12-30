import Tool from "@/components/Tool";
import type { Metadata } from "next";
import Blog from "@/blog/index.mdx";

export default function Home() {
  return (
    <>
      <main className="px-4 sm:px-6 lg:px-48 max-w-7xl mx-auto">
        <div className="relative pt-6">
          <div className="py-12 md:py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-5xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  YouTube <span className="text-primary/90">Comment</span>{" "}
                  Finder And AI Analysis
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Search, Filter, Download & Analyze YouTube Comments
                </p>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
        <Tool />
        <Blog />
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title:
    "YouTube Comment Finder And AI Analysis - Search, Filter, Download & AI analyze YouTube Comments",
  description:
    "YouTube Comment Finder is a powerful tool that helps you search, filter, sort, download and AI analyze comments on YouTube videos with ease. Find relevant comments, identify popular ones, export data, and more.",
  keywords:
    "youtube comment search, search youtube comments, youtube comment finder, AI Analysis comment, comment finder youtube, yt comment search, comment finder, yt comment finder, youtube comments search, youtube comment searcher, comment search youtube, search for comments on youtube, youtube search comments, youtube comment viewer, search for a youtube comment, searching comments on youtube, comment history youtube, see my youtube comments, most liked youtube comments, youtube random comment picker, yt comment history, random comment picker, comments on youtube, youtube comments history, youtube comment history, most youtube comment likes, most liked comment in youtube, ytcomment, youtube comment picker, most liked youtube comment, most liked comment on youtube, my comments on youtube, see your youtube comments",
};
