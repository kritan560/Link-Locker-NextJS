import { KritanGithubProfile } from "@/constants/routes";
import { Session } from "next-auth";
import Link from "next/link";
import { FaPaste } from "react-icons/fa6";
import ClipboardContext from "./link-locker-clipboard-context";
import LockAnimation from "./link-locker-lock-animation";
import LinkLockerProfileAvatar from "./link-locker-profile-avatar";
import { ModeToggle } from "./mode-toggle";

type LinkLockerRightNavbarProps = {
  session: Session | null;
};

const LinkLockerRightNavbar = (props: LinkLockerRightNavbarProps) => {
  const { session } = props;

  const authUserImage = session?.user.image;

  return (
    <div className="w-full rounded-2xl px-6 py-2 bg-gray-50 dark:bg-stone-700 flex justify-between items-center shadow-md shadow-stone-400 dark:shadow-stone-600">
      <div>
        <p className="text-lg font-medium">
          <span className="text-sky-500 font-semibold text-[19px]">Link</span>{" "}
          Locker
        </p>
        <span className="font-light text-xs block text-stone-600 dark:text-stone-300">
          A product by{" "}
          <Link
            href={KritanGithubProfile}
            className="text-stone-800 dark:text-stone-100"
          >
            Kritan
          </Link>
        </span>
      </div>
      <div className="flex gap-x-2 md:gap-x-4 items-center">
        {session && (
          <ClipboardContext>
            <FaPaste
              id="step-2"
              size={25}
              className="cursor-pointer fill-sky-500 hover:fill-sky-600 transition active:fill-sky-500"
            />
          </ClipboardContext>
        )}
        <ModeToggle />
        {session ? (
          <LinkLockerProfileAvatar authUserImage={authUserImage} />
        ) : (
          <LockAnimation
            size={40}
            className="transition hover:scale-105 active:scale-100"
          />
        )}
      </div>
    </div>
  );
};

export default LinkLockerRightNavbar;
