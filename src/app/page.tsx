import { auth } from "@/auth";
import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkComponent from "@/components/link-locker-link-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";
import MainPageTourGuide from "@/components/main-page-tour-guide";
import { FallbackUrls } from "@/constants/fallback-urls";
import { GetLinks } from "@/servers/link/get-links";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return;
  }

  const userId = session.user.id;
  const { data: urls } = await GetLinks(userId);

  return (
    // <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
    //   {/* left size */}
    //   <LinkLockerLeftComponent showButton={!!session} />

    //   {/* right side */}
    //   <div className="md:w-[45%] w-full min-w-[250px] p-2">
    //     <LinkLockerRightNavbar session={session} />

    //     {/* links card */}
    //     <div className=" rounded-2xl px-6 bg-gray-50 dark:bg-stone-700 mt-2 h-[calc(100vh-170px)] relative  overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sky-500 scrollbar-thumb-rounded-full hover:scrollbar-thumb-sky-400 active:scrollbar-thumb-sky-500 shadow-md shadow-stone-400 dark:shadow-stone-600">
    //       <div className="text-center py-3 z-10 bg-gray-50 dark:bg-stone-700 font-semibold text-lg scale-105 sticky top-0">
    //         {urls && urls.length > 0 ? (
    //           <p>
    //             {" "}
    //             <span className="text-sky-500">Link</span> Locker Got Your Links
    //           </p>
    //         ) : (
    //           "Currently ther are no links Paste Some links To View"
    //         )}
    //       </div>

    //       {/* links */}
    //       <div className="text-white space-y-3 my-1">
    //         {urls && urls?.length > 0 ? (
    //           urls?.map((url) => <LinkComponent key={url.id} content={url} />)
    //         ) : (
    //           <>
    //             <p className="text-stone-800 dark:text-stone-200">
    //               To keep things interesting, Link Locker has provided these
    //               links for you.
    //             </p>
    //             {FallbackUrls.map((url) => (
    //               <LinkComponent
    //                 key={url.id}
    //                 content={url}
    //                 showFallbackOptions={true}
    //               />
    //             ))}
    //           </>
    //         )}
    //       </div>

    //       {/* this div is to make a padding at bottom : this should not be necessary when padding is given to parent element but it did not work as expecteded so this is a work around */}
    //       <div className="sticky bottom-0 bg-gray-50 dark:bg-stone-700 h-10 w-full scale-105 z-10"></div>
    //     </div>
    //   </div>
    // </div>
    <MainPageTourGuide session={session} urls={urls} />
  );
}
