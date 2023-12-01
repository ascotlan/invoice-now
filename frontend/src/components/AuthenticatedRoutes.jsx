import { Navigate, Outlet } from "react-router-dom";
import useUserContext from "../hooks/use-user-context";
import Empty from "./Empty";

function AuthenticatedRoutes() {
  const { isAuthenticated, validatingSession, isLoading, error } = useUserContext();

  if (validatingSession) {
    return <Empty isLoading={isLoading} isError={error}/>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default AuthenticatedRoutes;
