'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth"
import {auth} from "../../firebase"
import {Auth, createUserWithEmailAndPassword, sendSignInLinkToEmail} from "firebase/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const toggleView = () => setIsLogin(!isLogin)

  const [CreateUserWithEmailAndPassword] =  useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailandPassword] = useSignInWithEmailAndPassword(auth);

  const handleSignin = async () => {
    try {
      const res = await signInWithEmailandPassword(email, password);
      console.log({res});
      setEmail('');
      setPassword('');
      sessionStorage.setItem("user", "true");
      router.push("/");
    }catch(e){
      console.error(e);
    }
    };
 
  const handleSignup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      console.log({res})
      setEmail("");
      setPassword(""); 
      sessionStorage.setItem("user", "true");
      } catch(e){
        console.error(e);
      }
  };


  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden w-1/2 bg-cyan-100 lg:block">
        <Image
          src={isLogin ? "/login-placeholder.svg" : "/signup-placeholder.svg"}
          alt={isLogin ? "Login illustration" : "Signup illustration"}
          width={800}
          height={800}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
            <button onClick={toggleView} className="font-medium text-cyan-600 hover:text-cyan-500">
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
          <form className="mt-8 space-y-6">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1"
                  placeholder="LeBron James"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="student@memocurve.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                className="mt-1"
                placeholder="Enter 6 character or more"
              />
            </div>
            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1"
                  placeholder="Confirm your password"
                />
              </div>
            )}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </Label>
                </div>
                <div className="text-sm">
                  <Link href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            )}
            <div>
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500">
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                Sign in with Google
              </Button>
              <Button variant="outline" className="w-full">
                Sign in with Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}