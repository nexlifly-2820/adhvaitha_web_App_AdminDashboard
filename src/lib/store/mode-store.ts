import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Mode = 'app' | 'web'

interface ModeState {
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: 'app',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'dashboard-mode-storage',
    }
  )
)
