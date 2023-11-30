import { useContext } from "react";
import UserContext from "../context/user";

function useUserContext() {
  return useContext(UserContext);
}

export default useUserContext;