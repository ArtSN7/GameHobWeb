"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {

    const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    // Simulate login process
    try {
      setIsLoading(true)

      // In a real app, you would call your authentication API here
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      navigate("/")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-2 rounded-lg">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked })}
                    disabled={isLoading}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/auth/signup")}
              >
                Create an account
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[#64748b]">
        <p>© {new Date().getFullYear()} GameHub. All rights reserved.</p>
      </footer>
    </div>
  )
}

