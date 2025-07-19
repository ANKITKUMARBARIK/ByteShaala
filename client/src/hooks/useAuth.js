import { AuthContext } from "@context/AuthContext";
import { useContext } from "react";

export default function useAuth() {
  return useContext(AuthContext);
}
