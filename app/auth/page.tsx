"use client"
import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import AuthMenu from '../components/Auth/AuthMenu';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Wikibinge ⋅ Auth"
}

const AuthPage = () => {
  const { currentUser, userDataObj, logout } = useAuth();
  if (currentUser) {
    redirect("/app/personality")
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <AuthMenu/>
      </div>
    </div>

  )
}

export default AuthPage