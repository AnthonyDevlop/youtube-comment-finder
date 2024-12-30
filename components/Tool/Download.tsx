import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";
import { Fragment, useState } from "react";
import { writeFile, utils } from "xlsx";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "@/utils/help";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Notify from "@/components/Notify";

const items = [
  { name: "Save as Excel", type: "excel" },
  { name: "Save as JSON", type: "json" },
];

export default function Download({
  video,
  comments,
}: {
  video: youtube_v3.Schema$Video;
  comments: youtube_v3.Schema$CommentThread[];
}) {
  const [showNotify, setShowNotify] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    "Please select at least one comment"
  );

  const genXls = () => {
    const data = comments.map((item) => {
      return [
        item.snippet?.topLevelComment?.snippet?.authorDisplayName ?? "",
        item.snippet?.topLevelComment?.snippet?.textDisplay ?? "",
        item.snippet?.topLevelComment?.snippet?.likeCount ?? 0,
        item.snippet?.totalReplyCount ?? 0,
        item.snippet?.topLevelComment?.snippet?.publishedAt ?? 0,
        item.snippet?.topLevelComment?.snippet?.updatedAt ?? 0,
      ];
    });
    const title = [
      "author",
      "comment",
      "likes",
      "reply count",
      "publishedAt",
      "updatedAt",
    ];
    const ws = utils.aoa_to_sheet([title, ...data]);
    const wb = utils.book_new();
    const name = `${video?.snippet?.title ?? ""}_comments.xlsx`;
    utils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, name);
  };
  const genJson = () => {
    const blob = new Blob([JSON.stringify(comments, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${video?.snippet?.title ?? ""}_comments.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (type: string) => {
    if (comments.length == 0) {
      setShowNotify(true);
      return;
    }
    if (type === "json") {
      genJson();
    } else {
      genXls();
    }
  };
  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        type="button"
        className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      >
        Export Comments
      </button>
      <Menu as="div" className="relative -ml-px block">
        <Menu.Button className="relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 bg-primary focus:z-10 text-white">
          <span className="sr-only">Open options</span>
          <div className="h-5 w-5" aria-hidden="true">
            <ChevronDownIcon />
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer">
            <div className="py-1">
              {items.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <div
                      className={classNames(
                        active ? "bg-primary text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                      onClick={() => handleExport(item.type)}
                    >
                      {item.name}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <Notify show={showNotify} setShow={setShowNotify} text={errorMsg} />
    </div>
  );
}
