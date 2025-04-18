import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const fetchUserProfile = async (userId) => {
    try {
      // Try to fetch the user profile
      let { data, error } = await supabase
        .from("users")
        .select("id, email, balance, level, created_at")
        .eq("id", userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        // No row found, create a default profile
        const { data: newProfile, error: insertError } = await supabase
          .from("users")
          .insert({
            id: userId,
            email: (await supabase.auth.getUser()).data.user.email,
            balance: 10000.0,
            level: 1,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setProfile(newProfile);
      } else if (data.length > 1) {
        // Multiple rows found, log warning and use the first row
        console.warn(`Multiple rows found for user ID ${userId}. Using the first row.`);
        setProfile(data[0]);
      } else {
        // Exactly one row found
        setProfile(data[0]);
      }

      setBalance(data[0].balance);

    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      setProfile(null); // Ensure profile is null on error
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      setBalance(0);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  useEffect(() => {
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

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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

  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    balance,
    setBalance,
    updateBalance,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}