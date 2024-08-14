import { cn } from "@/lib/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, ButtonProps } from "./ui/button";

type ButtonWithSpinnerProps = {
  isPending: boolean;
  otherComponentPendingState?: boolean;
  title: string;
  buttonClass?: string;
  spinnerSize?: number;
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  type?: ButtonProps["type"];
};

/**
 * This component will display the button with spinner that spins during the pending state only and disable the button
 *
 * @param props - ButtonWithSpinnerProps
 * @returns
 */
const ButtonWithSpinner = (props: ButtonWithSpinnerProps) => {
  const {
    isPending,
    buttonClass,
    spinnerSize = 17,
    title,
    onClick,
    otherComponentPendingState,
    variant,
    type,
  } = props;

  return (
    <Button
      onClick={onClick}
      disabled={isPending || otherComponentPendingState}
      variant={variant}
      className={cn(
        variant !== "ghost"
          ? variant !== "link"
            ? "w-full h-12 text-white bg-gray-800 hover:bg-gray-900 active:bg-gray-800 transition duration-300"
            : ""
          : "",
        buttonClass
      )}
      type={type}
    >
      <span className="relative">
        {title}{" "}
        <span className="text-inherit inline absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full">
          <AiOutlineLoading3Quarters
            size={spinnerSize}
            className={cn(isPending ? "block animate-spin" : "hidden")}
          />
        </span>
      </span>
    </Button>
  );
};

export default ButtonWithSpinner;
