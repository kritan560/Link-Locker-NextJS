"use client";

import { FallbackUrls } from "@/constants/fallback-urls";
import { cn } from "@/lib/utils";
import { Url } from "@prisma/client";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import { useEffect, useOptimistic, useRef, useState } from "react";
import { BsAlphabetUppercase } from "react-icons/bs";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import LinkLockerLeftComponent from "./link-locker-left-component";
import LinkComponent from "./link-locker-link-component";
import LinkLockerRightNavbar from "./link-locker-right-navbar";
import TourGuide from "./TourGuide";
import { Input } from "./ui/input";

type MainPageTourGuideProps = {
  session: Session | null;
  urls: Url[];
  currentPage: number;
  totalPageNumber: number;
};

const MainPageTourGuide = (props: MainPageTourGuideProps) => {
  const { session, urls, currentPage, totalPageNumber } = props;

  const router = useRouter();
  const [startTour, setStartTour] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  // start the onboarding process
  const handleStartTour = () => {
    localStorage.setItem("tourGuideStarted", "true");
    setStartTour(true);
  };

  // end the onboarding process
  const handleTourEnd = () => {
    localStorage.setItem("tourGuideStarted", "false");
    setStartTour(false);
  };

  useEffect(() => {
    const localStorage = window.localStorage;

    const doesLocalStorageHaveTourGuideStartedKey =
      localStorage.getItem("tourGuideStarted");

    if (doesLocalStorageHaveTourGuideStartedKey === null) {
      localStorage.setItem("tourGuideStarted", "true");
    }

    setLoaded(true);
  }, []);

  const [optimisticUrls, addOptimisticUrls] = useOptimistic(
    urls,
    (state, action: Url[]) => [...action, ...state]
  );

  if (!loaded) {
    return null;
  }

  /**
   * invoked when right arrow is clicked.
   *
   * handles two condition
   *
   * links with search params and links without search param
   * @returns
   */
  function handleRightArrowClick() {
    if (searchParams.get("search")) {
      router.push(`?search=${searchValue}&page=${currentPage + 1}`);

      nProgress.start();
      return;
    }

    router.push(`?page=${currentPage + 1}`);
    nProgress.start();
  }

  /**
   * invoked when right arrow is clicked.
   * 
   * handles two condition
   * 
   * links with search params and links without search param

   * @returns 
   */
  function handleLeftArrowClick() {
    if (searchParams.get("search")) {
      router.push(`?search=${searchValue}&page=${currentPage - 1}`);

      nProgress.start();
      return;
    }

    router.push(`?page=${currentPage - 1}`);
    nProgress.start();
  }

  /**
   * invoked when search icon is clicked
   *
   * focus the input element when click.
   *
   * serves two purpose
   * 1. open the input element when clicked
   *
   * 2. if input is already open serve as button when clicked
   */
  function handleFiSearchClick() {
    setShowTitle(false);

    if (!showTitle) {
      router.push(`?search=${searchValue}`);
      nProgress.start();
    }

    // timeout is set to delay the input focus. coz it need to focus only when the function is invoked the state setShowTitle is set
    setTimeout(() => {
      inputRef.current?.focus();
    }, 99);
  }

  return (
    <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
      <TourGuide
        start={startTour}
        setStartTour={setStartTour}
        onTourEnd={handleTourEnd}
      />{" "}
      {/* left size */}
      <LinkLockerLeftComponent
        addOptimisticUrls={addOptimisticUrls}
        handleStartTour={handleStartTour}
        showButton={!!session}
      />
      {/* right side */}
      <div className="md:w-[45%] w-full min-w-[250px] p-2">
        <LinkLockerRightNavbar
          addOptimisticUrls={addOptimisticUrls}
          session={session}
        />

        {/* links card */}
        <div className=" rounded-2xl px-6 bg-gray-50 dark:bg-stone-700 mt-2 h-[calc(100vh-170px)] relative  overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sky-500 scrollbar-thumb-rounded-full hover:scrollbar-thumb-sky-400 active:scrollbar-thumb-sky-500 shadow-md shadow-stone-400 dark:shadow-stone-600">
          <div
            className={cn(
              "flex sticky top-0 justify-between items-center gap-x-3 py-2 bg-inherit z-10"
            )}
          >
            <div className="flex gap-x-3 items-center">
              <FaArrowCircleLeft
                onClick={handleLeftArrowClick}
                size={21}
                className={cn(
                  "cursor-pointer",
                  currentPage <= 0 &&
                    "opacity-30 pointer-events-none cursor-not-allowed"
                )}
              />
              <BsAlphabetUppercase
                size={21}
                className="cursor-pointer"
                onClick={() => setShowTitle(true)}
              />
            </div>

            {showTitle ? (
              <div className="text-center z-10 bg-gray-50 dark:bg-stone-700 font-semibold text-lg scale-105 h-10 flex items-center">
                {optimisticUrls.length > 0 && (
                  <p>
                    <span className="text-sky-500">Link</span> Locker Got Your
                    Links
                  </p>
                )}

                {optimisticUrls.length <= 0 && (
                  <span>No links Found. Paste Some links To View</span>
                )}
              </div>
            ) : (
              <Input
                placeholder="Search Links"
                ref={inputRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-10 bg-stone-800 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFiSearchClick();
                  }
                }}
              />
            )}

            <div className="flex gap-x-3 items-center">
              <FiSearch
                size={21}
                className="cursor-pointer"
                onClick={handleFiSearchClick}
              />

              <FaArrowCircleRight
                onClick={handleRightArrowClick}
                size={21}
                className={cn(
                  "cursor-pointer",
                  currentPage >= totalPageNumber - 1 &&
                    "pointer-events-none opacity-30 cursor-not-allowed"
                )}
              />
            </div>
          </div>

          {/* links */}
          <div className="text-white space-y-3 my-1">
            {optimisticUrls.length > 0 ? (
              optimisticUrls?.map((optimisticUrl, index) => (
                <LinkComponent key={optimisticUrl.id} content={optimisticUrl} />
              ))
            ) : (
              <>
                <p className="text-stone-800 dark:text-stone-200">
                  To keep things interesting, Link Locker has provided these
                  links for you.
                </p>
                {FallbackUrls.map((url) => (
                  <LinkComponent
                    key={url.id}
                    content={url}
                    showFallbackOptions={true}
                  />
                ))}
              </>
            )}
          </div>

          {/* this div is to make a padding at bottom : this should not be necessary when padding is given to parent element but it did not work as expecteded so this is a work around */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-stone-700 h-10 w-full scale-105 z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default MainPageTourGuide;
