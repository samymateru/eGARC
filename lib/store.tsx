import { create } from "zustand";

type EngagementTabState = {
  tab: string;
  setTab: (tab: string) => void;
};

export const useEngamentTabStore = create<EngagementTabState>((set) => ({
  tab: "administration",
  setTab: (tab) => set({ tab }),
}));
