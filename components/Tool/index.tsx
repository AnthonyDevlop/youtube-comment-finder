"use client";
import { useState } from "react";
import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";
import { classNames } from "@/utils/help";
import List from "./List";
import Detail from "./Detail";
import Notify from "@/components/Notify";
import {
  MagnifyingGlassCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function Tool() {
  const [url, setUrl] = useState("");

  const [showDetail, setShowDetail] = useState(false);
  const [videoDefatil, setVideoDefatil] = useState<youtube_v3.Schema$Video>({});
  const [loading, setLoading] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const showError = (text: string) => {
    setErrorMsg(text);
    setShowNotify(true);
  };

  const requestFn = async () => {
    if (loading || url.trim() === "") return;
    try {
      const id = new URL(url).searchParams.get("v");
      if (id) {
        setLoading(true);
        setShowDetail(false);
        // const res = await video(id);
        const res = await fetch("/api/video", {
          method: "POST",
          body: JSON.stringify({
            id,
          }),
        });
        // @ts-ignore
        const { data } = await res.json();
        setVideoDefatil(data);
        setShowDetail(true);
      } else {
        showError("Something wrong, check the url");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      showError("Something wrong, check the url");
    }
  };

  return (
    <>
      <div>
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium leading-6 text-gray-900 sr-only"
          >
            Search
          </label>
          <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                name="url"
                id="url"
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter A Youtube Video Url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={classNames(
                "relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold bg-primary text-white ring-1 ring-inset ring-gray-300 hover:bg-primary/60 rounded-r-md",
              )}
              onClick={requestFn}
            >
              {loading ? (
                <ArrowPathIcon
                  className="-ml-0.5 h-5 w-5 text-white animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <MagnifyingGlassCircleIcon
                  className="-ml-0.5 h-5 w-5 text-white"
                  aria-hidden="true"
                />
              )}
              Search
            </button>
          </div>
        </div>
      </div>
      {showDetail && <Detail data={videoDefatil} />}
      {showDetail && <List id={videoDefatil.id ?? ""} video={videoDefatil} />}
      <Notify show={showNotify} setShow={setShowNotify} text={errorMsg} />
    </>
  );
}
