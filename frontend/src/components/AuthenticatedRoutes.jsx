import { Navigate, Outlet } from "react-router-dom";
import useUserContext from "../hooks/use-user-context";

function AuthenticatedRoutes() {
  const { isAuthenticated } = useUserContext();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default AuthenticatedRoutes;


