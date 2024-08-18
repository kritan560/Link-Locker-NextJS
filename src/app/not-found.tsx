import LinkLockerLeftComponent from "@/components/link-locker-left-component";
import LinkLockerRightNavbar from "@/components/link-locker-right-navbar";
import { LinkLockerHomepage } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
      {/* left size */}
      <LinkLockerLeftComponent showButton={false} />

      {/* right side */}
      <div className="md:w-[45%] w-full min-w-[250px] p-2">
        <LinkLockerRightNavbar session={null} />

        {/* links card */}
        <div className=" rounded-2xl px-6 bg-gray-50 dark:bg-stone-700 mt-2 h-[calc(100vh-170px)] relative  overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sky-500 scrollbar-thumb-rounded-full hover:scrollbar-thumb-sky-400 active:scrollbar-thumb-sky-500 shadow-md shadow-stone-400 dark:shadow-stone-600 z-0">
          {/* NOT found page */}
          <h1 className="font-semibold text-2xl text-stone-800 absolute top-8 z-10 left-1/2 -translate-x-1/2">
            404 Page Not Found
            <br />
            <Link
              className="underline text-sky-600 absolute left-1/2 -translate-x-1/2"
              href={LinkLockerHomepage}
            >
              Homepage
            </Link>
          </h1>
          <Image
            src={"/not-found.webp"}
            alt="Not Found"
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
