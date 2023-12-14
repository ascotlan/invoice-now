import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

// Accessing the API URL from environment variables
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validatingSession, setValidatingSession] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //Validate session on browser reload
  // useEffect(() => {
  //   const validateSession = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch(`${apiUrl}/api/auth/validate-session`, {
  //         credentials: "include", // Important for including the session cookie
  //       });

  //       if (response.ok) {
  //         const userData = await response.json();
  //         // Set user data in context
  //         setUser(userData);
  //         setIsAuthenticated(true);
  //       } else {
  //         // Handle unauthenticated user
  //         setIsAuthenticated(false);
  //         navigate("/");
  //       }
  //     } catch (error) {
  //       console.error("Session validation failed", error);
  //     } finally {
  //       setValidatingSession(false);
  //       setIsLoading(false);
  //     }
  //   };

  //   validateSession();
  // }, [navigate]);

  const login = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/auth/login/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for including the session cookie
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      const userData = await response.json();
      setIsAuthenticated(true);
      setUser(userData);
      navigate("/invoices");
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
      const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for including the session cookie
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Perform necessary clean up after successful logout
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
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
    validatingSession,
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
