import Link from "next/link";
import { LinkLockerExtensionLink } from "./routes";

export enum LinkLockerDescriptionEnum {
  STRING = "STRING",
  LINK = "LINK",
  BUTTON = "BUTTON",
}

type LinkLockerDescriptionType = {
  id: string;
  type: LinkLockerDescriptionEnum;
  description: React.JSX.Element;
}[];

export const LinkLockerDescription: LinkLockerDescriptionType = [
  {
    id: crypto.randomUUID(),
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span className="capitalize">
        Share Your <span className="font-medium ">Saved Links</span>
      </span>
    ),
  },
  {
    id: crypto.randomUUID(),
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span className="capitalize">
        View Your <span className="font-medium ">Links</span>
      </span>
    ),
  },
  {
    id: crypto.randomUUID(),
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span className="capitalize">
        <span className="font-medium ">Blur</span> Your Links
      </span>
    ),
  },
  {
    id: crypto.randomUUID(),
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span className="capitalize">
        Store links in <span className="font-medium ">Private Vault</span>
      </span>
    ),
  },
  {
    id: crypto.randomUUID(),
    type: LinkLockerDescriptionEnum.LINK,
    description: (
      <Link
        target="_blank"
        href={LinkLockerExtensionLink}
        className="capitalize font-medium text-sky-500"
      >
        Get Chrome Extension
      </Link>
    ),
  },
  {
    type: LinkLockerDescriptionEnum.BUTTON,
    description: (
      <span className="">
        Click here to{" "}
        <span className="font-medium cursor-pointer text-sky-800 dark:text-sky-500">
          add Copied Link
        </span>
      </span>
    ),
    id: "step-1",
  },
  {
    type: LinkLockerDescriptionEnum.BUTTON,
    description: (
      <span className="text-sky-800 dark:text-sky-500  font-medium">
        Guide Me
      </span>
    ),
    id: "guide-me-id",
  },
];
