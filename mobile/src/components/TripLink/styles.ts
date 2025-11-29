import { tv } from "tailwind-variants/lite";

export const tripLinkStyles = tv({
  slots: {
    base: "w-full flex-row items-center gap-4",
    container: "flex-1",
    title: "text-zinc-100 text-base font-semibold",
    url: "text-zinc-400 text-sm",
  },
});
