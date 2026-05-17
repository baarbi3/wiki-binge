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
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

      if (error) {
        console.error("Signup error:", error);
        return;
      }

      const user = data.user;

      // Email confirmation enabled:
      // user may exist but session may not.
      if (!user) {
        console.warn("No user returned.");
        return;
      }

      // ---------------------------------------
      // Insert profile row
      // ---------------------------------------

      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            email: user.email,
            username,
            profile_img: "",
          },
        ]);

      if (insertError) {
        console.error(
          "Error inserting profile:",
          insertError
        );

        return;
      }

      setCurrentUser(user);

      // If user is immediately authenticated
      if (data.session) {
        await fetchProfile(user.id);
      }

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

      if (error) {
        console.error("Login error:", error);
      }

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

    if (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      return;
    }

    setUserDataObj(data);
  }

  // ---------------------------------------
  // Logout
  // ---------------------------------------

  async function logout() {
    await supabase.auth.signOut();

    setCurrentUser(null);
    setUserDataObj(null);
  }

  // ---------------------------------------
  // Init + Auth Listener
  // ---------------------------------------

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      setLoading(true);

      // Initial session fetch
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const user = session?.user ?? null;

      setCurrentUser(user);

      if (user) {
        await fetchProfile(user.id);
      }

      setLoading(false);

      // Auth listener
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

      return subscription;
    }

    let subscription:
      | Awaited<ReturnType<typeof initialize>>
      | undefined;

    initialize().then((sub) => {
      subscription = sub;
    });

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  // ---------------------------------------
  // Derived Verification State
  // ---------------------------------------

  const isVerified =
    !!currentUser?.email_confirmed_at;

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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}