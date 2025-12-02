import { tv } from "tailwind-variants/lite";

export const inputStyles = tv({
  slots: {
    base: "min-h-16 max-h-16 flex-row items-center gap-2 rounded-lg px-4",
    field: "flex-1 text-zinc-100 text-lg font-regular",
  },
  variants: {
    variant: {
      primary: "",
      secondary: "h-14 border-zinc-800 bg-zinc-950",
      tertiary: "h-14 border border-zinc-800 bg-zinc-900",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
