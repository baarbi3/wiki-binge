'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from '../context/AuthContext';
import AuthForm from './AuthForm';

export type AuthFormState = {
  email: string,
  username?: string,
  password: string,
  register: boolean,
};


const AuthMenu = (props: any) => {
  const {login, signup, currentUser} = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState<AuthFormState>({
    email: "",
    username: "",
    password: "",
    register: false
  })
  const { email, password, username, register } = form
  const [authenticating, setAuthenticating] = useState<boolean>(false)



  async function handleSubmit() {
    if (!email || !password || (register && !username) || password.length < 6) {
      return
    }
    
    setAuthenticating(true)
    try {
      if (register) {
        console.log('Signing up a new user')
        if (!username) return
        await signup(email, password, username)
      } else {
        console.log('Logging in existing user')
        await login(email, password)
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message)
      } else {
        console.log(String(err))
      }
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <div className={"flex flex-col gap-6"} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <AuthForm form={form} setForm={setForm} onSubmit={handleSubmit}/>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

export default AuthMenu