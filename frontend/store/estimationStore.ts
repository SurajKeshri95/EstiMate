import { create } from 'zustand';

export interface Estimation {
  id: string;
  projectName: string;
  estimatedHours: number;
  estimatedCost: number;
  createdAt: string;
}

export interface EstimationState {
  currentEstimation: Estimation | null;
  estimationHistory: Estimation[];
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentEstimation: (estimation: Estimation) => void;
  addToHistory: (estimation: Estimation) => void;
  clearCurrentEstimation: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearHistory: () => void;
}

export const useEstimationStore = create<EstimationState>((set) => {
  return {
    currentEstimation: null,
    estimationHistory: [],
    loading: false,
    error: null,

    setCurrentEstimation: (estimation: Estimation) => {
      set({ currentEstimation: estimation });
    },

    addToHistory: (estimation: Estimation) => {
      set((state: EstimationState) => ({
        estimationHistory: [estimation, ...state.estimationHistory],
      }));
    },

    clearCurrentEstimation: () => {
      set({ currentEstimation: null });
    },

    setLoading: (loading: boolean) => {
      set({ loading });
    },

    setError: (error: string | null) => {
      set({ error });
    },

    clearHistory: () => {
      set({ estimationHistory: [] });
    },
  };
});