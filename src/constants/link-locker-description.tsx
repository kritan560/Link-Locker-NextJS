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
    id: "random",
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span>
        <span className="font-medium text-sky-900 dark:text-sky-500">Store</span> Your Links
      </span>
    ),
  },
  {
    id: "random2",
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span className="capitalize">
        Share Your <span className="font-medium text-sky-900 dark:text-sky-500">Saved Links</span>
      </span>
    ),
  },
  {
    id: "random3",
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span className="capitalize">
        View Your <span className="font-medium text-sky-900 dark:text-sky-500">Links</span>
      </span>
    ),
  },
  {
    id: "random4",
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span className="capitalize">
        <span className="font-medium text-sky-900 dark:text-sky-500">Blur</span> Your Links
      </span>
    ),
  },
  {
    id: "random5",
    type: LinkLockerDescriptionEnum.STRING,
    description: (
      <span className="capitalize">
        Store links in <span className="font-medium text-sky-900 dark:text-sky-500">Private Vault</span>
      </span>
    ),
  },
  {
    id: "random6",
    type: LinkLockerDescriptionEnum.LINK,
    description: (
      <span>
        Get <span className="font-medium text-sky-900 dark:text-sky-500">Chrome Extension</span>
      </span>
    ),
  },
  {
    type: LinkLockerDescriptionEnum.BUTTON,
    description: (
      <span className="">
        Click to <span className="font-medium text-sky-900 dark:text-sky-500">add Copied URL</span>
      </span>
    ),
    id: "step-1",
  },
  {
    type: LinkLockerDescriptionEnum.BUTTON,
    description: <span className="text-sky-900 dark:text-sky-500 font-medium">Guide Me</span>,
    id: "guide-me-id",
  },
];
