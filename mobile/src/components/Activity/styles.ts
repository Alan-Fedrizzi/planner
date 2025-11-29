import { tv } from "tailwind-variants/lite";

export const activityStyles = tv({
  slots: {
    base: "w-full bg-zinc-900 px-4 py-3 rounded-lg flex-row items-center border border-zinc-800 gap-3",
    title: "text-zinc-100 font-regular text-base flex-1",
    hour: "text-zinc-400 font-regular text-sm",
  },
  variants: {
    isBefore: {
      true: "opacity-50",
    },
  },
});
