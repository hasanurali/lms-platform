import { create } from "zustand"

const useStore = create((set) => ({

    scrolled: false,
    setScrolled: (val) => set({
        scrolled: val
    }),

    currentInstructorId: null,
    setCurrentInstructorId: (instructorId) => set({
        currentInstructorId: instructorId
    }),

    activeTab: "profile",
    setActiveTab: (tab) => set({
        activeTab: tab
    }),

}))

export default useStore;