import { useContext } from "react";
import { GlobalContext } from "@/app/GlobalContext";


const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default useGlobalContext;