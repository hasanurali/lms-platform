import { create } from "zustand";
import socket from "@/socket/socket";

const useSocketStore = create(() => ({
    socket,
}));

export default useSocketStore;