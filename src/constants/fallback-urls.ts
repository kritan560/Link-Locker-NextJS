type FallbackUrlsType = {
  id: string;
  url: string;
  blur: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}[];

export const FallbackUrls: FallbackUrlsType = [
  {
    blur: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "5",
    url: "https://discord.com/users/772841274071842847",
    userId: "1",
  },
  {
    blur: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "4",
    url: "https://www.linkedin.com/in/kritan-shrestha-52a61a144/",
    userId: "1",
  },
  {
    blur: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "1",
    url: "https://github.com/kritan560",
    userId: "1",
  },
];
