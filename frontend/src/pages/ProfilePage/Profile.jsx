"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Coins } from "lucide-react";
import { motion } from "framer-motion";

import Footer from "../Utils/Footer";
import InGameHeader from "../Utils/InGameHeader";
import ProfileHeader from "./Components/ProfileHeader";

import Promocodes from "./Components/Promocodes/Promocodes";
import RewardsMainComp from "./Components/Rewards/RewardsMainComp.jsx";


import {useUser} from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { isAuthenticated } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
  }, [isAuthenticated]);


  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <InGameHeader IsShowGuide={false} />
      
      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <ProfileHeader />

        <Tabs defaultValue="promocodes" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="promocodes" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Promocodes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="mt-6">
            <RewardsMainComp setShowConfetti={setShowConfetti}/>
          </TabsContent>

          <TabsContent value="promocodes" className="mt-6">
            <Promocodes 
              setShowConfetti={setShowConfetti}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Ad Dialog for playing AD */}

      {/*
      <AdDialog 
        showAdDialog={showAdDialog}
        setShowAdDialog={setShowAdDialog}
      />
      */}

      {/* Show confetti when the user claims a reward */}
      {showConfetti && (ConfettiFunction)}
    </div>
  );
}


const ConfettiFunction = (
  <>     
  
  <div className="fixed inset-0 pointer-events-none z-50">
    {Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        initial={{
          top: "-10%",
          left: `${Math.random() * 100}%`,
          backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        }}
        animate={{
          top: "110%",
          left: `${Math.random() * 100}%`,
          rotate: Math.random() * 360,
        }}
        transition={{ duration: Math.random() * 2 + 2, ease: "easeOut" }}
      />
    ))}
  </div>
  </>  );
