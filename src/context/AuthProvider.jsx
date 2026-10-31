import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { supabase } from "../lib/supabase";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      setUser(data?.session?.user ?? null);
      setStatus(error ? "error" : "ready");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setStatus("ready");
    });
    return () => { mounted = false; listener?.subscription?.unsubscribe(); };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    return data;
  }, []);

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/store/account" } });
    if (error) throw error;
    if (data.user && data.session) setUser(data.user);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, status, signIn, signUp, signOut }), [user, status, signIn, signUp, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
