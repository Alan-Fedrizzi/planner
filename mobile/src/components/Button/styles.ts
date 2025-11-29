import { tv } from "tailwind-variants/lite";

export const buttonStyles = tv({
  slots: {
    base: "h-11 flex-row items-center justify-center rounded-lg gap-2 px-2",
    spinner: "",
    text: "text-base font-semibold",
  },
  variants: {
    variant: {
      primary: {
        base: "bg-lime-300",
        spinner: "text-lime-950",
        text: "text-lime-950",
      },
      secondary: {
        base: "bg-zinc-800",
        spinner: "text-lime-300",
        text: "text-zinc-200",
      },
    },
    isLoading: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
