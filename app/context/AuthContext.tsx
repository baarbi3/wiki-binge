'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase/client";

export type UserData = {
  id: string;
  created_at: string;
  email: string;
  username: string;
  profile_img: string;
};

export type AuthContextType = {
  currentUser: User | null;
  userDataObj: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserDataObj: React.Dispatch<React.SetStateAction<UserData | null>>;
  update: (username: string, profile_img: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export const supabase = createClient();
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDataObj, setUserDataObj] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Signup ---
  async function signup(email: string, password: string, username: string) {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      console.error("Signup error:", error);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      console.warn("Signup pending email verification. No user object returned.");
      setLoading(false);
      return;
    }

    // Inserting data into DB
/*
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ id: user.id, email: user.email, username }]);

    if (insertError){
       console.error("Error inserting user:", insertError)
       setLoading(false);
       return;
    };
*/
    setCurrentUser(user);
    setLoading(false);
  }

  // --- Login ---
  async function login(email: string, password: string) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {console.error("Login error:", error); setLoading(false); return;};
    setLoading(false);
  }

  // --- Update ---
async function update(username?: string, profile?: string) {
  if (!userDataObj?.id) {
    throw new Error("User ID missing");
  }
  console.log(profile)

  const { data, error } = await supabase
    .from('users')
    .update({ username, profile_img: profile })
    .eq('id', userDataObj.id)
    .select();

  if (error) {
    console.error("Update Profile Error", error);
    return;
  }

  console.log("Updated row:", data);
}

  // --- Logout ---
  async function logout() {
    await supabase.auth.signOut();
    setUserDataObj(null);
    setCurrentUser(null);
  }

  // --- Auth State Listener ---
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function init() {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setCurrentUser(session?.user ?? null);
        setLoading(false);

        if (!session?.user) {
          setUserDataObj(null);
          return;
        }

        const { data: profile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single<UserData>();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        setUserDataObj(profile);
      });

      unsubscribe = data.subscription.unsubscribe;
    }
    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    userDataObj,
    loading,
    signup,
    login,
    logout,
    setUserDataObj,
    update
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
