import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Spade, X } from "lucide-react"; // Added X for closing the menu

import { useState } from "react";

import {useUser} from "@/context/UserContext";

export default function Header() {
  const { user, isLoading, error, logout } = useUser();

  const navigate = useNavigate();

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!user){
    navigate('/auth/login');
  }


  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-[#e2e8f0]">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-1.5 rounded-lg">
            <Spade className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight">GameHob</span>
        </div>

        {/* Profile and Menu Button */}
        <div className="flex items-center gap-4">
          <Link to="/profile" className="relative">
            <img
              src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Artem?height=40&width=40`}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-blue-500 object-cover transition-transform hover:scale-105"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </Link>
        </div>
      </div>


    </header>
  );
}