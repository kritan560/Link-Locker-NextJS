import {
  LinkLockerDescription,
  LinkLockerDescriptionEnum,
} from "@/constants/link-locker-description";
import { LinkLockerHomepage } from "@/constants/routes";
import Link from "next/link";
import { LuDot } from "react-icons/lu";
import ClipboardContext from "./link-locker-clipboard-context";
import LockAnimation from "./link-locker-lock-animation";

type LinkLockerLeftComponentProps = {
  showButton: boolean;
  handleStartTour?: () => void;
};

/**
 * This component is displayed at the left side in link locker homepage, sign-in, sign-up, verify-page
 * @returns
 */
const LinkLockerLeftComponent = (props: LinkLockerLeftComponentProps) => {
  const { showButton, handleStartTour } = props;

  return (
    <div className="px-24 py-12 min-w-[50%] hidden md:block">
      <div className="w-fit">
        <Link href={LinkLockerHomepage}>
          <LockAnimation className="mb-3 hover:scale-105 transition active:scale-100 w-fit" />
        </Link>
      </div>

      <div className="text-6xl font-normal">
        <h1>Link</h1>
        <h1 className="text-sky-500">Locker</h1>
      </div>

      <p className="mt-4">Keep your favorite Links safe</p>

      <p className="text-[22px] font-medium mt-4">
        <span className="text-sky-500">Link Locker </span> Includes
      </p>
      <ul className="mt-2 list-none">
        {LinkLockerDescription.map((data, index) => (
          <div id={data.id} key={index} className="flex gap-x-1  items-center">
            {data.type == LinkLockerDescriptionEnum.BUTTON &&
              showButton &&
              data.id !== "guide-me-id" && (
                <>
                  <LuDot size={22} />
                  <ClipboardContext>
                    {/* <span className="text-sky-500">{data.description}</span> */}
                    {data.description}
                  </ClipboardContext>
                </>
              )}

            {data.type === LinkLockerDescriptionEnum.BUTTON &&
              data.id === "guide-me-id" &&
              showButton && (
                <div
                  onClick={handleStartTour}
                  className="cursor-pointer flex gap-x-1 items-center"
                >
                  <LuDot size={22} />
                  {/* <span className="text-sky-500">{data.description}</span> */}
                  {data.description}
                </div>
              )}

            {data.type === LinkLockerDescriptionEnum.STRING && (
              <>
                <LuDot size={22} />
                {/* <li className="capitalize">{data.description}</li> */}
                {data.description}
              </>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default LinkLockerLeftComponent;
