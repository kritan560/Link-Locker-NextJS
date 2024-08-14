"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type LinkLockerTooltipProps = {
  children: React.ReactNode;
  content: string;
  showTooltipContent?: boolean;
  contentBlur?: boolean;
  tooltipTriggerClass?: string;
};

const LinkLockerTooltip = (props: LinkLockerTooltipProps) => {
  const {
    content,
    children,
    showTooltipContent = true,
    contentBlur,
    tooltipTriggerClass,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [showTooltip, setshowTooltip] = useState(true);

  useEffect(() => {
    if (ref.current) {
      const divWidth = ref.current.clientWidth;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        context.font = "bold 1rem sans";
        const textLength = context?.measureText(content).width;

        if (textLength && textLength > divWidth) {
          setshowTooltip(true);
        } else {
          setshowTooltip(false);
        }
      }
    }
  }, [content]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <div
            ref={ref}
            className={cn(
              "w-full truncate text-base relative z-[2]",
              contentBlur && "blur",
              tooltipTriggerClass
            )}
          >
            {children}
          </div>
        </TooltipTrigger>

        {/* calculate the width of a div and the dynamically update the value */}
        {showTooltipContent && !contentBlur && showTooltip ? (
          <TooltipContent className="dark:bg-stone-900 contrast-75">
            {content}
          </TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  );
};

export default LinkLockerTooltip;
