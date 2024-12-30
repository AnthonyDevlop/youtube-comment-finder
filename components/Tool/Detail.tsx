import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";
import {
  EyeIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Detail({ data }: { data: youtube_v3.Schema$Video }) {
  const snippet = data.snippet;
  const statistics = data.statistics;
  return (
    <div className="flex flex-wrap my-16 justify-center">
      <div className="md:mr-4 flex-shrink-0 mb-2">
        <img
          className="h-auto w-80 md:w-48"
          src={snippet?.thumbnails?.standard?.url ?? ""}
        />
      </div>
      <div>
        <h4 className="text-lg font-bold">{snippet?.title ?? ""}</h4>
        <h4 className="text-md truncate w-72 md:w-[36rem] mb-2">
          {snippet?.description ?? ""}
        </h4>
        <div className="flex flex-col">
          <div className="flex w-full flex-none gap-x-2">
            <dt className="flex-none">
              <span className="sr-only">ChannelTitle</span>
              <UserCircleIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {snippet?.channelTitle ?? ""}
            </dd>
          </div>
          <div className="flex w-full flex-none gap-x-2">
            <dt className="flex-none">
              <span className="sr-only">ViewCount</span>
              <EyeIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              {statistics?.viewCount ?? ""}
            </dd>
          </div>
          <div className="flex w-full flex-none gap-x-2">
            <dt className="flex-none">
              <span className="sr-only">CommentCount</span>
              <ChatBubbleBottomCenterTextIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              {statistics?.commentCount ?? ""}
            </dd>
          </div>
          <div className="flex w-full flex-none gap-x-2">
            <dt className="flex-none">
              <span className="sr-only">LikeCount</span>
              <HeartIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              {statistics?.likeCount ?? ""}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
