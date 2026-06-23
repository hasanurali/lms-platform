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

}))

export default useStore;