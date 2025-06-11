import { create } from "zustand";

type EngagementTabState = {
  tab: string;
  setTab: (tab: string) => void;
};

export const useEngamentTabStore = create<EngagementTabState>((set) => ({
  tab: "administration",
  setTab: (tab) => set({ tab }),
}));

type ProcedureEditorVisibility = {
  openProcedureEditor: boolean;
  setProcedureEditor: (value: boolean) => void;
};

export const useProcedureEditorVisibility = create<ProcedureEditorVisibility>(
  (set) => ({
    openProcedureEditor: true,
    setProcedureEditor: (value) => set({ openProcedureEditor: value }),
  })
);

type AdministrationEditorVisibility = {
  openAdministationEditor: boolean;
  setAdministrationEditor: (value: boolean) => void;
};

export const useAdministrationEditorVisibility =
  create<AdministrationEditorVisibility>((set) => ({
    openAdministationEditor: true,
    setAdministrationEditor: (value) => set({ openAdministationEditor: value }),
  }));
