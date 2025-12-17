"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  value?: number | string;
  onValueChange?: (value: number | "") => void;
  min?: number;
  max?: number;
  clampOnBlur?: boolean;
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { className, value, onValueChange, min, max, clampOnBlur = true, ...props },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        type="number"
        value={value}
        inputMode="decimal"
        className={cn(
          "appearance-none",
          "[&::-webkit-inner-spin-button]:appearance-none",
          "[&::-webkit-outer-spin-button]:appearance-none",
          "[-moz-appearance:textfield]",
          className
        )}
        onKeyDown={(e) => {
          if (["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const val = e.target.value;
          onValueChange?.(val === "" ? "" : Number(val));
        }}
        onBlur={(e) => {
          if (!clampOnBlur) return;

          let val = Number(e.target.value);
          if (isNaN(val)) return;

          if (min !== undefined) val = Math.max(min, val);
          if (max !== undefined) val = Math.min(max, val);

          onValueChange?.(val);
        }}
        {...props}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";
