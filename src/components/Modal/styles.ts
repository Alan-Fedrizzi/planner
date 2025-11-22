import { tv } from "tailwind-variants/lite";

export const modalStyles = tv({
  slots: {
    blur: "flex-1",
    container: "flex-1 justify-end bg-black/60",
    wrapper: "bg-zinc-900 border-t border-zinc-700 px-6 pt-5 pb-10",
    inner: "flex-row justify-between items-center pt-5",
    titleStyle: "text-white font-medium text-xl",
    subtitleStyle: "text-zinc-400 font-regular leading-6 my-2",
  },
});
