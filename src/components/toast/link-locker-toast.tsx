import { Toast } from "react-hot-toast";
import LockAnimation from "../link-locker-lock-animation";
import { cn } from "@/lib/utils";

type LinkLockerToastJSXType = {
  t: Toast;
  toastMessage: string;
  error?: boolean;
};

export const LinkLockerToastJSX = ({
  t,
  toastMessage,
  error,
}: LinkLockerToastJSXType) => (
  <div
    id={t.id}
    className={cn(
      "w-fit px-4 py-2 rounded-md bg-gradient-to-tr from-sky-400 to-sky-500 text-stone-50",
      error && "bg-gradient-to-tr from-red-400 to-pink-500"
    )}
  >
    <div className="flex gap-x-2 items-center">
      <LockAnimation
        className={cn("fill-sky-600", error && "fill-rose-800")}
        size={25}
      />
      <p>{toastMessage}</p>
    </div>
  </div>
);
