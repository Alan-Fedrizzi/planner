import { tv } from "tailwind-variants/lite";

export const layoutStyles = tv({
  base: "flex-1 bg-zinc-950",
});

export const indexStyles = tv({
  slots: {
    container: "p-6",
    image: "h-8",
    imageBg: "absolute",
    text: "text-zinc-400 font-regular text-center text-lg mt-3",
    inputContainer:
      "w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800 gap-2",
    buttonContainer: "border-b py-3 border-zinc-800",
    policyText: "text-zinc-500 font-regular text-center text-base",
    policyTextInner: "text-zinc-300 underline",
    modalCalendarContainer: "gap-4 mt-4",
    modalGuestsContainer:
      "my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start",
    modalGuestNoEmail: "text-zinc-600 text-base font-regular",
    modalGuestsBottom: "gap-4 mt-4",
  },
});
