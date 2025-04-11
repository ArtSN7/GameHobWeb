"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Eye, EyeOff, AlertCircle, Loader2, Check, X, Apple, Chrome } from "lucide-react"
import { motion } from "framer-motion"

export default function SignupPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Check password strength when password changes
    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password) => {
    // Simple password strength checker
    let strength = 0
    let feedback = ""

    if (password.length === 0) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    // Length check
    if (password.length >= 8) {
      strength += 25
    } else {
      feedback = "Password should be at least 8 characters"
    }

    // Contains lowercase
    if (/[a-z]/.test(password)) {
      strength += 25
    } else if (!feedback) {
      feedback = "Add lowercase letters"
    }

    // Contains uppercase
    if (/[A-Z]/.test(password)) {
      strength += 25
    } else if (!feedback) {
      feedback = "Add uppercase letters"
    }

    // Contains numbers or special chars
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength += 25
    } else if (!feedback) {
      feedback = "Add numbers or special characters"
    }

    // Set feedback based on strength
    if (strength === 100 && !feedback) {
      feedback = "Strong password"
    } else if (strength >= 75 && !feedback) {
      feedback = "Good password"
    } else if (strength >= 50 && !feedback) {
      feedback = "Moderate password"
    } else if (strength >= 25 && !feedback) {
      feedback = "Weak password"
    }

    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 100) return "bg-green-500"
    if (passwordStrength >= 75) return "bg-blue-500"
    if (passwordStrength >= 50) return "bg-yellow-500"
    if (passwordStrength >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordStrength < 50) {
      setError("Please use a stronger password")
      return
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and privacy policy")
      return
    }

    // Simulate signup process
    try {
      setIsLoading(true)

      // In a real app, you would call your registration API here
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful signup
      navigate("/")
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 shadow-sm">
        <div className="container flex items-center h-16 px-4">
          <Link href="/" className="flex items-center text-[#666666] hover:text-blue-500 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

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
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">Enter your details to create your account</CardDescription>
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
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
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
                  <Label htmlFor="password">Password</Label>
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
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <Progress value={passwordStrength} className={`h-1.5 ${getPasswordStrengthColor()}`} />
                        <span className="text-xs ml-2 text-gray-500">
                          {passwordStrength === 100 ? (
                            <span className="text-green-500 flex items-center">
                              <Check className="h-3 w-3 mr-1" />
                              Strong
                            </span>
                          ) : (
                            passwordFeedback
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && (
                    <div className="flex items-center mt-1">
                      {formData.password === formData.confirmPassword ? (
                        <span className="text-xs text-green-500 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Passwords match
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 flex items-center">
                          <X className="h-3 w-3 mr-1" />
                          Passwords don't match
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked })}
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <Label htmlFor="agreeTerms" className="text-sm font-normal cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-500 hover:text-blue-700 transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-500 hover:text-blue-700 transition-colors">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
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
                  <span className="bg-white px-2 text-gray-500">OR SIGN UP WITH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setIsLoading(true)
                    // In a real app, you would implement Google OAuth here
                    setTimeout(() => setIsLoading(false), 1500)
                  }}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4" />
                  <span>Google</span>
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setIsLoading(true)
                    // In a real app, you would implement Apple OAuth here
                    setTimeout(() => setIsLoading(false), 1500)
                  }}
                  disabled={isLoading}
                >
                  <Apple className="h-4 w-4" />
                  <span>Apple</span>
                </Button>
              </div>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">ALREADY HAVE AN ACCOUNT?</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/auth/login")}
              >
                Sign in with existing account
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
