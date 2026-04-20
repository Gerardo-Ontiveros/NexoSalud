import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AccessibilityState {
  fontSize: 'normal' | 'large' | 'xlarge'
  highContrast: boolean
  reducedMotion: boolean
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  reset: () => void
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      fontSize: 'normal',
      highContrast: false,
      reducedMotion: false,
      setFontSize: (fontSize) => set({ fontSize }),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
      toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
      reset: () => set({ fontSize: 'normal', highContrast: false, reducedMotion: false }),
    }),
    { name: 'accessibility-storage' }
  )
)