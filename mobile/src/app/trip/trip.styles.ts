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
    modalConfirmContainer: "gap-4 mt-4",
    modalConfirmText: "text-zinc-400 font-regular leading-6 my-2",
    modalConfirmHighlight: "font-semibold text-zinc-100",
  },
});

export const activitiesStyles = tv({
  slots: {
    container: "flex-1",
    top: "w-full flex-row mt-5 mb-6 items-center",
    title: "text-zinc-50 text-2xl font-semibold flex-1",
    listContainer: "w-full",
    listDay: "text-zinc-50 text-2xl font-semibold py-2",
    listDayWeek: "text-zinc-500 text-base font-regular capitalize",
    listEmptyText: "text-zinc-500 font-regular text-sm mb-8",
    newActivityModalContainer: "mt-4 mb-3",
    newActivityModalInputs: "w-full mt-2 flex-row gap-2",
    newActivityModalInput: "flex-1",
  },
});

export const detailsStyles = tv({
  slots: {
    container: "flex-1 mt-10",
    title: "text-zinc-50 text-2xl font-semibold mb-2",
    linksContainer: "flex-1",
    linksEmpty: "text-zinc-400 font-regular text-base mt-2 mb-6",
    invitedContainer: "flex-1 border-t border-zinc-800 mt-6",
    invitedTitle: "text-zinc-50 text-2xl font-semibold my-6",
    modalContainer: "gap-2 mb-3",
  },
});
