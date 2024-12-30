import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";
import { classNames } from "@/utils/help";
import Order from "./Order";
import PerPage from "./PerPage";
import Download from "./Download";
import {
  MagnifyingGlassCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import AIDialog from "./AIDialog";
import { useChat } from "ai/react";
import Notify from "@/components/Notify";

export default function List({
  id,
  video,
}: {
  id: string;
  video: youtube_v3.Schema$Video;
}) {
  const { messages, stop, setInput, handleSubmit, setMessages } = useChat();
  const [list, setList] = useState<youtube_v3.Schema$CommentThread[]>([]);
  const [search, setSearch] = useState("");
  const [pageToken, setPageToken] = useState("");
  const [order, setOrder] = useState("Time");
  const [page, setPage] = useState(20);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [moreloading, setMoreLoading] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showAi, setShowAi] = useState(false);
  const listEl = useRef(null);

  const handleModalStatus = (status: boolean) => {
    if (!status) {
      stop();
    }
    setShowAi(status);
  };

  const showError = (text: string) => {
    setErrorMsg(text);
    setShowNotify(true);
  };

  const loadComment = async (reset = false) => {
    if (loading || moreloading) return;
    try {
      if (reset) {
        setLoading(true);
        setList([]);
        setPageToken("");
      } else {
        setMoreLoading(true);
      }
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          pageToken,
          videoId: id,
          maxResults: page,
          order: order.toLocaleLowerCase(),
          searchTerms: search,
        }),
      });

      // @ts-ignore
      const { data } = await res.json();
      setList((pre) => [...pre, ...(data.items ?? [])]);
      setPageToken(data?.nextPageToken ?? "");
      if ((data?.nextPageToken ?? "") === "") {
        setHasMore(false);
      }
      setLoading(false);
      setMoreLoading(false);
    } catch (error) {
      setLoading(false);
      setMoreLoading(false);
      console.log(error);
    }
  };

  const checkbox = useRef(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedComment, setSelectedComment] = useState<
    Map<string, youtube_v3.Schema$CommentThread>
  >(new Map());

  const handleToggleSingleCheck = (
    id: string,
    data: youtube_v3.Schema$CommentThread,
  ) => {
    const checked = selectedComment.has(id);
    setSelectedComment((prevMap) => {
      // We need to create a new Map to make sure React knows the state has changed
      const newMap = new Map(prevMap);
      if (checked) {
        newMap.delete(id);
      } else {
        newMap.set(id, data);
      }
      return newMap;
    });
  };

  // useEffect(() => {
  //   loadComment();
  // }, []);

  useEffect(() => {
    loadComment(true);
  }, [order, page]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedComment.size > 0 && selectedComment.size < list.length;
    setChecked(selectedComment.size === list.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      // @ts-ignore
      checkbox.current.indeterminate = isIndeterminate;
    }

    const prompt = genPrompt(
      video?.snippet?.title ?? "",
      video?.snippet?.description ?? "",
      Array.from(selectedComment.values())
        .map(
          (item) => item?.snippet?.topLevelComment?.snippet?.textDisplay ?? "",
        )
        .join("\n"),
    );

    setMessages([]);
    setInput(prompt);
    if (listEl.current) {
      if (list.length > page) {
        // @ts-ignore
        listEl.current.scrollTo({
          left: 0,
          // @ts-ignore
          top: listEl.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [selectedComment, list.length]);

  function toggleAll() {
    // setSelectedComment(checked || indeterminate ? [] : list);
    const newMap = new Map<string, youtube_v3.Schema$CommentThread>();
    if (!(checked || indeterminate)) {
      list.forEach((item) => {
        newMap.set(item.id ?? "", item);
      });
    }
    setSelectedComment(newMap);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  function genPrompt(title: string, desc: string, list: string) {
    return `You are a highly advanced AI model specializing in natural language processing and sentiment analysis. Your task is to analyze the comments from a YouTube video and generate a detailed summary. This summary should include the following elements:
1. Overall Sentiment: Determine the general sentiment (positive, negative, neutral) expressed in the comments.
2. Trending Topics: Identify the most frequently discussed topics or themes.
3. Key Points: Highlight any important points or recurring issues mentioned by the commenters.
4. Summary: Provide a concise summary that encapsulates the overall discussion in the comments.

Please analyze the comments and the answer should include four parts: 
1. Overall Sentiment:
2. Trending Topics:
3. Key Points:
4. Summary:

Requirement: 
1. Return the analyzed content directly, and do not return any extra information, your answer should start with 'Overall Sentiment'
2. Return strictly in the specified format, the format is as follows (The title and content need to be wrapped directly):

Overall Sentiment:
xxx xxx (your answer)

Trending Topics:
xxx xxx (your answer)

Key Points:
xxx xxx (your answer)

Summary:
xxx xxx (your answer)

3. Be careful not to repeat your answers. Just answer each part once.

Here is the title and description of the YouTube video to provide context:

Title: ${title}
Description: ${desc}

Here are the comments from this YouTube video:

${list}

`;
  }

  function handleSubmitAi(e: any) {
    e.preventDefault();
    if (selectedComment.size === 0) {
      showError("Select comments to analyze");
      return;
    }
    // @ts-ignore
    window.gtag("event", 'ai_start');
    setShowAi(true);
    handleSubmit(e);
  }

  return (
    <>
      <div className="text-xl font-semibold leading-6 text-gray-900">
        Filters
      </div>
      <div className="mt-2 grid grid-cols-3 gap-x-6 gap-y-8 md:grid-cols-8">
        <div className="col-span-3">
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Keyword
          </label>
          <div className="mt-2 flex rounded-md shadow-sm items-center">
            <div className="relative flex flex-grow items-stretch focus-within:z-10 ">
              <input
                name="url"
                id="url"
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter A Keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={classNames(
                "relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold bg-primary text-white ring-1 ring-inset ring-gray-300 hover:bg-primary/60 rounded-r-md",
              )}
              onClick={() => loadComment(true)}
            >
              <MagnifyingGlassCircleIcon
                className="-ml-0.5 h-5 w-5 text-white"
                aria-hidden="true"
              />
              Search
            </button>
          </div>
        </div>
        <div className="col-span-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Order
          </label>

          <Order
            value={order}
            onChange={(value) => {
              setOrder(value);
            }}
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Comments per page
          </label>

          <PerPage value={page} onChange={setPage} />
        </div>
      </div>

      <div className="text-xl font-semibold leading-6 text-gray-900 mt-5">
        Comments
      </div>
      <div className="sm:flex sm:items-center flex justify-end space-x-2 my-4">
        <div className="sm:flex-auto"></div>
        <form onSubmit={handleSubmitAi}>
          <button
            type="submit"
            className={classNames(
              "relative inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold bg-primary text-white ring-1 ring-inset ring-gray-300 hover:bg-primary/60 rounded-md",
            )}
          >
            <SparklesIcon className="w-5 h-5" />
            <div className="text-nowrap">AI Analysis</div>
          </button>
        </form>
        <div className="sm:ml-16 sm:mt-0 sm:flex-none">
          <Download
            video={video}
            comments={Array.from(selectedComment.values())}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Select All
        </label>
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          ref={checkbox}
          checked={checked}
          onChange={toggleAll}
        />
      </div>

      {loading ? (
        <ul
          role="list"
          className="divide-y divide-gray-100 flex justify-center items-center h-96"
        >
          <ArrowPathIcon className="animate-spin h-16 w-16 text-primary/60" />
        </ul>
      ) : (
        <ul
          role="list"
          ref={listEl}
          className="divide-y divide-gray-300 h-[36rem] overflow-scroll"
        >
          {list.map((comment) => (
            <li
              key={comment.id}
              className={classNames(
                "flex gap-x-4 py-5 relative pr-4 pl-12",
                selectedComment.has(comment?.id ?? "") && "bg-gray-50",
              )}
            >
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                value={comment?.id ?? ""}
                checked={selectedComment.has(comment?.id ?? "")}
                onChange={() =>
                  handleToggleSingleCheck(comment.id ?? "", comment)
                }
              />

              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={
                  comment?.snippet?.topLevelComment?.snippet
                    ?.authorProfileImageUrl ?? ""
                }
                width={48}
                height={48}
                alt=""
              />
              <div className="flex-auto">
                <div className="flex items-baseline justify-between gap-x-4">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {comment?.snippet?.topLevelComment?.snippet
                      ?.authorDisplayName ?? ""}
                  </p>
                  <p className="flex-none text-xs text-gray-600">
                    <time
                      dateTime={
                        comment?.snippet?.topLevelComment?.snippet
                          ?.publishedAt ?? ""
                      }
                    >
                      {comment?.snippet?.topLevelComment?.snippet?.publishedAt}
                    </time>
                  </p>
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
                  {comment?.snippet?.topLevelComment?.snippet?.textDisplay ??
                    ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {hasMore ? (
        <button
          className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          onClick={() => loadComment()}
        >
          Load more
        </button>
      ) : (
        <div className="text-center mt-4">no More</div>
      )}

      {showAi && (
        <AIDialog
          setOpen={handleModalStatus}
          video={video}
          messages={messages}
        />
      )}
      <Notify show={showNotify} setShow={setShowNotify} text={errorMsg} />
    </>
  );
}
