import { tv } from "tailwind-variants/lite";

export const participantStyles = tv({
  slots: {
    base: "w-full flex-row items-center",
    container: "flex-1",
    name: "text-zinc-100 text-base font-semibold",
    email: "text-zinc-400 text-sm",
  },
});
