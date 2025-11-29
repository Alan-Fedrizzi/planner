import { tv } from "tailwind-variants/lite";

export const tripStyles = tv({
  slots: {
    container: "flex-1 px-5 pt-16",
    button: "w-9 h-9 bg-zinc-800 items-center justify-center rounded",
    bottom:
      "w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950",
    bottomContainer:
      "w-full flex-row bg-zinc-900 p-4 rounded-lg border border-zinc-800 gap-2",
    buttonBottom: "flex-1",
    modalUpdateContainer: "gap-2 my-4",
    modalUpdateRemove: "text-red-400 text-center mt-6",
  },
});
