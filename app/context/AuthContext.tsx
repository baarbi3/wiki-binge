'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase/client";

export type UserData = {
  id: string;
  created_at: string;
  email: string;
  username: string;
  profile_img: string;
  embedding_sum: number[];
  like_count: number;
};

export type AuthContextType = {
  currentUser: User | null;
  userDataObj: UserData | null;
  loading: boolean;

  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  update: (
    username?: string,
    profile_img?: string
  ) => Promise<void>;

  setUserDataObj:
    React.Dispatch<React.SetStateAction<UserData | null>>;

  isVerified: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return ctx;
}

export const supabase = createClient();

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [userDataObj, setUserDataObj] =
    useState<UserData | null>(null);

  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // Fetch Profile
  // ---------------------------------------

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single<UserData>();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setUserDataObj(data);
  }

  // ---------------------------------------
  // Signup
  // ---------------------------------------

  async function signup(
    email: string,
    password: string,
    username: string
  ) {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }, // trigger reads this via raw_user_meta_data
        },
      });

      // Let the caller handle and display the error
      if (error) throw error;

      // Profile row is now created automatically by the
      // DB trigger — nothing else to do here.

    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------
  // Login
  // ---------------------------------------

  async function login(
    email: string,
    password: string
  ) {
    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------
  // Update Profile
  // ---------------------------------------

  async function update(
    username?: string,
    profile_img?: string
  ) {
    if (!userDataObj?.id) {
      throw new Error("User ID missing");
    }

    const updates: Partial<UserData> = {};

    if (username !== undefined) {
      updates.username = username;
    }

    if (profile_img !== undefined) {
      updates.profile_img = profile_img;
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userDataObj.id)
      .select()
      .single();

    if (error) throw error;

    setUserDataObj(data);
  }

  // ---------------------------------------
  // Logout
  // ---------------------------------------

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setCurrentUser(null);
    setUserDataObj(null);
  }

  // ---------------------------------------
  // Init + Auth Listener
  // ---------------------------------------

  useEffect(() => {
    // Register the listener FIRST (synchronously) so no
    // auth events are missed while getSession() is in flight.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;

        setCurrentUser(user);

        if (!user) {
          setUserDataObj(null);
          return;
        }

        await fetchProfile(user.id);
      }
    );

    // Then resolve the initial session
    supabase.auth.getSession().then(
      ({ data: { session } }) => {
        const user = session?.user ?? null;

        setCurrentUser(user);

        if (user) {
          fetchProfile(user.id).finally(() =>
            setLoading(false)
          );
        } else {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ---------------------------------------
  // Derived Verification State
  // ---------------------------------------

  const isVerified = !!currentUser?.email_confirmed_at;

  const value: AuthContextType = {
    currentUser,
    userDataObj,
    loading,
    signup,
    login,
    logout,
    update,
    setUserDataObj,
    isVerified,
  };

  // Render a blank screen (or swap in a spinner) while the
  // initial session check is in flight so children never
  // see a half-initialised auth state.
  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}