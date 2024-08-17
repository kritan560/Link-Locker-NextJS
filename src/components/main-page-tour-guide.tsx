"use client";

import { FallbackUrls } from "@/constants/fallback-urls";
import { Url } from "@prisma/client";
import { Session } from "next-auth";
import { useEffect, useOptimistic, useState } from "react";
import LinkLockerLeftComponent from "./link-locker-left-component";
import LinkComponent from "./link-locker-link-component";
import LinkLockerRightNavbar from "./link-locker-right-navbar";
import TourGuide from "./TourGuide";

type MainPageTourGuideProps = {
  session: Session | null;
  urls: Url[];
};

const MainPageTourGuide = (props: MainPageTourGuideProps) => {
  const { session, urls } = props;

  const [startTour, setStartTour] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleStartTour = () => {
    localStorage.setItem("tourGuideStarted", "true");
    setStartTour(true);
  };

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
    (state, action: Url) => [...state, action]
  );

  if (!loaded) {
    return null;
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
          <div className="text-center py-3 z-10 bg-gray-50 dark:bg-stone-700 font-semibold text-lg scale-105 sticky top-0">
            {optimisticUrls.length > 0 && (
              <p>
                <span className="text-sky-500">Link</span> Locker Got Your Links
              </p>
            )}

            {optimisticUrls.length <= 0 && (
              <span>Currently ther are no links Paste Some links To View</span>
            )}
          </div>

          {/* links */}
          <div className="text-white space-y-3 my-1">
            {optimisticUrls.length > 0 ? (
              optimisticUrls?.map((optimisticUrl) => (
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
