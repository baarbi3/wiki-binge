"use client"

import { redirect } from "next/navigation";
import AppSidebar from "../components/Sidebar/AppSidebar";
import { useAuth } from "../context/AuthContext";
import Feed from "../components/Feed/Feed";

const AppPage = () => {
  const {currentUser} = useAuth();
  
  if (!currentUser) {
    redirect("/auth")
  }

  return (
    <div className="w-full"><Feed/></div>
  )
}

export default AppPage
