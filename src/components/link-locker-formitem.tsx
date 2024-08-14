import React from "react";
import LinkLockerTooltip from "./link-locker-tooltip";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type LinkLockerFormItemProps = {
  field: any;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  disabled?: boolean;
  formLabel?: string;
  showTooltip?: boolean;
  description?: string;
  showInputShadow?: boolean;
};

const LinkLockerFormItem = (props: LinkLockerFormItemProps) => {
  const {
    field,
    placeholder,
    type = "text",
    disabled = false,
    formLabel,
    showTooltip,
    description,
    showInputShadow = true,
  } = props;

  return (
    <FormItem className="relative">
      {FormLabel && <FormLabel>{formLabel}</FormLabel>}
      <FormControl className="relative z-10 opacity-100">
        <LinkLockerTooltip
          showTooltipContent={showTooltip}
          /**
           * content prop is visible only when showTooltipContent is true
           * tooltip is manually controlled here. making a way to display tooltip when hover over email
           */
          content="You cannot update Email"
        >
          <div>
            <Input
              disabled={disabled}
              className={cn(
                "border-b-0 shadow-md dark:shadow-stone-700 dark:bg-stone-900 h-12 ring-0 border-none placeholder:text-stone-400",
                showInputShadow ? "shadow-md" : "shadow-none"
              )}
              placeholder={placeholder}
              type={type}
              {...field}
            />
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className="text-red-500" />
          </div>
        </LinkLockerTooltip>
      </FormControl>
    </FormItem>
  );
};

export default LinkLockerFormItem;
