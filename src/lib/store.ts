import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Documentation State
  currentSection: string
  setCurrentSection: (section: string) => void
  
  // Search State
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // User Preferences
  preferences: {
    autoSave: boolean
    showLineNumbers: boolean
    wordWrap: boolean
  }
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Documentation State
      currentSection: 'introduction',
      setCurrentSection: (section) => set({ currentSection: section }),
      
      // Search State
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // User Preferences
      preferences: {
        autoSave: true,
        showLineNumbers: true,
        wordWrap: false,
      },
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
    }),
    {
      name: 'speck-it-app-store',
      partialize: (state) => ({
        preferences: state.preferences,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)