'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { loginUser } from '@/store/reducer/authSlice'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Mail, Lock, Loader2 } from 'lucide-react'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserDetails } from '@/store/reducer/userDetailsSlice'

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm()
 

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      await new Promise((resolve, reject) => {
        dispatch(loginUser(data))
          .unwrap()
          .then((result) => {
            toast("Login successful!")
            resolve(result)
            dispatch(fetchUserDetails(result.user.id))
          
          })
          .catch((error) => {
            reject(error)
          })
      })
   
      
      // Optionally, you can add additional logic here like redirecting
    } catch (error) {
      toast.error(error?.error || "An unexpected error occurred", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
    
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Please sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="w-full"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="off"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="w-full"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
         
          <Button variant="link">Forgot password?</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

