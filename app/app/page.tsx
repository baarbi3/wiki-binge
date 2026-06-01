"use client"

import { redirect } from "next/navigation";
import AppSidebar from "../components/Sidebar/AppSidebar";
import { useAuth } from "../context/AuthContext";

const AppPage = () => {
  const {currentUser} = useAuth();
  
  if (!currentUser) {
    redirect("/auth")
  }

  return (
    <></>
  )
}

export default AppPage