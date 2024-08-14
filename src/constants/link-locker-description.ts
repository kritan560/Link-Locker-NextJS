export enum LinkLockerDescriptionEnum {
  STRING = "STRING",
  LINK = "LINK",
  BUTTON = "BUTTON",
}

export const LinkLockerDescription = [
  {
    id: "random",
    type: LinkLockerDescriptionEnum.STRING,
    description: "Keep your own links",
  },
  {
    id: "random2",
    type: LinkLockerDescriptionEnum.STRING,
    description: "Share Your Saved Links",
  },
  {
    id: "random3",
    type: LinkLockerDescriptionEnum.STRING,
    description: "View Your Links",
  },
  {
    id: "random4",
    type: LinkLockerDescriptionEnum.STRING,
    description: "Blur Your Links",
  },
  {
    id: "random5",
    type: LinkLockerDescriptionEnum.STRING,
    description: "Store links in Private Vault",
  },
  {
    id: "random6",
    type: LinkLockerDescriptionEnum.LINK,
    description: "Get Chrome Extension",
  },
  {
    type: LinkLockerDescriptionEnum.BUTTON,
    description: "Click to add Copied URL",
    id: "step-1",
  },
  {
    type: LinkLockerDescriptionEnum.BUTTON,
    description: "Guide Me",
    id: "guide-me-id",
  },
];
