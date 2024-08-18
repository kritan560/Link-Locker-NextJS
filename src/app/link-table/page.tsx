import { LinkTableReturnUrlType } from "../../../types/link-table-return-type";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function DemoPage() {
  async function getData(): Promise<LinkTableReturnUrlType> {
    // Fetch data from your API here.
    return [
      {
        blur: true,
        updatedAt: new Date("2024-08-16T06:35:50.562+00:00"),
        createdAt: new Date("2024-05-16T06:35:50.562+00:00"),
        url: "https://link-locker-xi.vercel.app/",
      },
      {
        blur: true,
        updatedAt: new Date("2024-04-16T03:45:16.562+00:00"),
        createdAt: new Date("2024-02-16T06:35:50.562+00:00"),
        url: "https://github.com/JaleelB/emblor",
      },
      {
        blur: true,
        updatedAt: new Date("2024-01-16T07:15:30.562+00:00"),
        createdAt: new Date("2024-01-16T01:35:50.562+00:00"),
        url: "https://www.youtube.com/watch?v=fSeUTCSUJiA",
      },
      {
        blur: true,
        updatedAt: new Date("2024-08-16T06:35:50.562+00:00"),
        createdAt: new Date("2024-05-16T06:35:50.562+00:00"),
        url: "https://link-locker-xi.vercel.app/",
      },
      {
        blur: true,
        updatedAt: new Date("2024-04-16T03:45:16.562+00:00"),
        createdAt: new Date("2024-02-16T06:35:50.562+00:00"),
        url: "https://github.com/JaleelB/emblor",
      },
      {
        blur: true,
        updatedAt: new Date("2024-01-16T07:15:30.562+00:00"),
        createdAt: new Date("2024-01-16T01:35:50.562+00:00"),
        url: "https://www.youtube.com/watch?v=fSeUTCSUJiA",
      },
      {
        blur: true,
        updatedAt: new Date("2024-08-16T06:35:50.562+00:00"),
        createdAt: new Date("2024-05-16T06:35:50.562+00:00"),
        url: "https://link-locker-xi.vercel.app/",
      },
      {
        blur: true,
        updatedAt: new Date("2024-04-16T03:45:16.562+00:00"),
        createdAt: new Date("2024-02-16T06:35:50.562+00:00"),
        url: "https://github.com/JaleelB/emblor",
      },
      {
        blur: true,
        updatedAt: new Date("2024-01-16T07:15:30.562+00:00"),
        createdAt: new Date("2024-01-16T01:35:50.562+00:00"),
        url: "https://www.youtube.com/watch?v=fSeUTCSUJiA",
      },
      // ...
    ];
  }

  const data = await getData();

  return (
    <div className="overflow-clip h-[calc(100vh-80px)] font-light flex justify-between">
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
