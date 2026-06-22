import { create } from "zustand"

const useStore = create((set) => ({
    scrolled: false,
    setScrolled: (val) => set({
        scrolled: val
    })
}))

export default useStore;