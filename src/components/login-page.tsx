import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset any previous error messages
  
    try {
      if (isLogin) {
      // Handle login

      // Send token to backend to complete login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      // Redirect to dashboard after successful login
      router.push('/dashboard');
      
      } else {
        // Handle sign-up
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        });
  
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.error || 'Signup failed');
  
        // After sign-up, automatically log the user in (like in your code)
        
        // Send token to backend to complete login
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!loginResponse.ok) throw new Error('Login failed');
  
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
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
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
            <button onClick={toggleView} className="font-medium text-cyan-600 hover:text-cyan-500">
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                className="mt-1"
                placeholder="Enter 6 character or more"
              />
            </div>
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
        </div>
      </div>
    </div>
  );
}