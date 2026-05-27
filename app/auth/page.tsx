"use client"
import React from 'react'
import AuthMenu from '../components/AuthMenu';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const { currentUser, userDataObj, logout } = useAuth();
  if (currentUser) {
    return (
      <>
       You're logged in as {userDataObj?.username}
       <div className='w-full'>

       </div>
       <Button onClick={() => logout()}>Log Out</Button>
      </>
    )
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