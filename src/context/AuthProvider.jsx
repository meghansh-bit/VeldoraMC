import { useState, useCallback, useMemo } from "react";
import { AuthContext } from "./auth-context";

// Authentication stays unavailable until official Microsoft OAuth and a
// server-side session endpoint are configured. Never simulate a real login.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const signInWithMicrosoft = useCallback(async () => {
    setStatus("error");
    throw new Error("Microsoft sign-in is not configured yet.");
  }, []);
  const signOut = useCallback(() => { setUser(null); setStatus("idle"); }, []);
  const value = useMemo(() => ({ user, status, signInWithMicrosoft, signOut }), [user, status, signInWithMicrosoft, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
