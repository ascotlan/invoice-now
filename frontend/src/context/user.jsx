// context/UserContext.js
import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  //const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**************MOCK DATA***********************/
  const user = {
    userId: 1,
    userType: "business",
    name: "Antonio Scotland",
    picture_url: "https://i.pravatar.cc/60",
  };

  const isAuthenticated = true;
  const setIsAuthenticated = null;
  const setUser = null;
  /**********************************************/

  const login = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/login/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      const userData = await response.json();
      setIsAuthenticated(true);
      setUser(userData);
      navigate('/invoices');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Perform necessary clean up after successful logout
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const valuesToShare = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    error,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={valuesToShare}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserProvider };
export default UserContext;
