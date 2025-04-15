import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Create the context
const UserContext = createContext();

// Context provider
export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // Supabase auth user
  const [profile, setProfile] = useState(null); // Data from `users` table
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from `users` table
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, balance, level, created_at")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Check initial session
    const initializeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        await fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    };

    initializeSession();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session.user);
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to update balance (e.g., after a game)
  const updateBalance = async (newBalance) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("id", user.id);

      if (error) throw error;
      setProfile((prev) => ({ ...prev, balance: newBalance }));
    } catch (error) {
      console.error("Error updating balance:", error.message);
    }
  };

  // Context value
  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    updateBalance,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}