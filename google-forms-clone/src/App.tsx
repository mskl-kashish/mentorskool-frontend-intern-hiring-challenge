import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js"; // Import Session type
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import FormBuilder from "./FormBuilder";

export default function App() {
  const [session, setSession] = useState<Session | null>(null); // Explicitly set type

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe(); // Clean up listener
    };
  }, []);

  return <div>{session ? <FormBuilder /> : <Auth />}</div>;
}
