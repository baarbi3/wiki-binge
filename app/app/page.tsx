"use client"

import { redirect } from "next/navigation";
import AppSidebar from "../components/Sidebar/AppSidebar";
import { useAuth } from "../context/AuthContext";
import Feed from "../components/Feed/Feed";
import { useRef } from "react";
import NavButtons from "../components/Feed/NavButtons";

const AppPage = () => {
  const {currentUser} = useAuth();
  
  if (!currentUser) {
    redirect("/auth")
  }

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full h-screen">
      {/* Scrollable snap container */}
      <div className="flex justify-center h-full w-full">
        <Feed containerRef={containerRef} />
      </div>
      <NavButtons containerRef={containerRef}/>
    </div>
  )
}

export default AppPage
