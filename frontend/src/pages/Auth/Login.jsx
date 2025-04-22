"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Apple, Chrome, Spade } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: contextLoading } = useUser();
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect authenticated users after render
  useEffect(() => {
    if (isAuthenticated && !contextLoading) {
      navigate("/home");
    }
  }, [isAuthenticated, contextLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formEmail || !formPassword) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: formEmail,
        password: formPassword,
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message || `Failed to login with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (contextLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-1.5 sm:p-2 rounded-lg">
                  <Spade className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">Log in</CardTitle>
            </CardHeader>

            <CardMainComp
              isLoading={isLoading}
              formEmail={formEmail}
              setFormEmail={setFormEmail}
              formPassword={formPassword}
              setFormPassword={setFormPassword}
              handleSubmit={handleSubmit}
              error={error}
            />

            <CardFooterComp isLoading={isLoading} handleOAuthLogin={handleOAuthLogin} />
          </Card>
        </motion.div>
      </main>

      <footer className="py-4 text-center text-xs sm:text-sm text-[#64748b]">
        <p>© {new Date().getFullYear()} GameHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

function CardMainComp({
  isLoading,
  formEmail,
  setFormEmail,
  formPassword,
  setFormPassword,
  handleSubmit,
  error,
}) {
  return (
    <CardContent>
      {error && (
        <Alert variant="destructive" className="mb-4 text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            disabled={isLoading}
            required
            className="h-12 sm:h-10 text-sm sm:text-base"
          />
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-12 sm:h-10 text-sm sm:text-base"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 sm:h-10 text-sm sm:text-base"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </CardContent>
  );
}

function CardFooterComp({ isLoading, handleOAuthLogin }) {
  const navigate = useNavigate();

  return (
    <CardFooter className="flex flex-col space-y-3 sm:space-y-4">
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="bg-white px-2 text-gray-500">OR CONTINUE WITH</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
        <Button
          variant="outline"
          type="button"
          className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 h-12 sm:h-10 text-sm sm:text-base"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading}
        >
          <Chrome className="h-4 w-4" />
          <span>Google</span>
        </Button>
        <Button
          variant="outline"
          type="button"
          className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 h-12 sm:h-10 text-sm sm:text-base"
          onClick={() => handleOAuthLogin("apple")}
          disabled={true}
        >
          <Apple className="h-4 w-4" />
          <span>Apple</span>
        </Button>
      </div>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="bg-white px-2 text-gray-500">DON'T HAVE AN ACCOUNT?</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-12 sm:h-10 text-sm sm:text-base"
        onClick={() => navigate("/auth/signup")}
      >
        Create an account
      </Button>
    </CardFooter>
  );
}