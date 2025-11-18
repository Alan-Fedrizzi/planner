import { tv } from "tailwind-variants/lite";

export const layoutStyles = tv({
  base: "flex-1 bg-zinc-950",
});

export const indexStyles = tv({
  slots: {
    container: "flex-1 items-center justify-center",
    image: "h-8",
    text: "text-zinc-400 font-regular text-center text-lg mt-3",
  },
});
