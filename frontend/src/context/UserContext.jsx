// information about user 

import { createContext, useContext, useState, useEffect } from 'react';

// Create the UserContext
const UserContext = createContext();

// Custom hook for consuming the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // null = not loaded, {} = user data, undefined = not logged in
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching user data (replace with real API call)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        // Example: Fetch user from an API
        // const response = await fetch('/api/user');
        // if (!response.ok) throw new Error('Failed to fetch user');
        // const userData = await response.json();
        
        // Simulated user data (replace with real data)
        const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
        
        setUser(userData); // Set user if logged in
        // If not logged in, you could setUser(undefined);
      } catch (err) {
        setError(err.message);
        setUser(undefined); // No user logged in
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []); // Runs once on mount

  // Functions to update user state
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      // Simulate login API call
      // const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify(credentials) });
      // if (!response.ok) throw new Error('Login failed');
      // const userData = await response.json();
      
      const userData = { id: 1, name: 'John Doe', email: credentials.email };
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err; // Let components handle login errors
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(undefined);
    setError(null);
  };

  // Value provided to consumers
  const value = {
    user, // Current user data (null, undefined, or object)
    isLoading, // Whether user data is being fetched
    error, // Any error from fetching user
    login, // Function to log in
    logout, // Function to log out
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}