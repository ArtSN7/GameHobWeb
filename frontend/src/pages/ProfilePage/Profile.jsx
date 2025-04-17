"use client";

import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Gift, Coins } from "lucide-react";
import { motion } from "framer-motion";

import Footer from "../Utils/Footer";
import InGameHeader from "../Utils/InGameHeader";
import ProfileHeader from "./Components/ProfileHeader";
import Bonuses from "./Components/Rewards/Bonuses";
import AvailableAds from "./Components/Rewards/AvailableAds";
import AdDialog from "./Components/Rewards/AdDialog";
import SpecialBonuses from "./Components/Rewards/SpecialBonuses";
import Promocodes from "./Components/Promocodes/Promocodes";
import { initialAds, watchAdFunc, claimAdRewardFunc, generateMoreAds } from "./Components/Rewards/AdUtils";

import { supabase } from "./../../lib/supabase";
import {useUser} from "@/context/UserContext";

export default function ProfilePage() {
  const { user, profile, balance, isLoading, isAuthenticated } = useUser();
  const [userData, setUserData] = useState(null);
  const [coins, setCoins] = useState(0);
  const [stats, setStats] = useState(null);
  const [bonuses, setBonuses] = useState(null);
  const [totalWins, setTotalWins] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [promocode, setPromocode] = useState("");
  const [promocodeStatus, setPromocodeStatus] = useState(null);
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [adProgress, setAdProgress] = useState(0);
  const [adPlaying, setAdPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [availableAds, setAvailableAds] = useState(initialAds);

  const watchAd = (ad) => watchAdFunc(ad, setCurrentAd, setAdProgress, setAdPlaying, setShowAdDialog);

  const claimAdReward = async () => {
    try {
      const updatedCoins = coins + currentAd.reward;

      // Update balance in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ balance: updatedCoins })
        .eq('id', user.id);

      if (error) throw error;

      setCoins(updatedCoins);
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);

      setShowAdDialog(false);
    } catch (error) {
      console.error('Failed to update balance:', error.message);
    }
  };

  const claimBonus = async (bonus) => {
    try {
      const updatedCoins = coins + bonus.reward;

      // Update balance in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ balance: updatedCoins })
        .eq('id', user.id);

      if (error) throw error;

      // Log bonus claim
      const { error: logError } = await supabase
        .from('bonus_logs')
        .insert({
          user_id: user.id,
          bonus_id: bonus.id,
          reward: bonus.reward,
          claimed_at: new Date().toISOString(),
        });

      if (logError) throw logError;

      setCoins(updatedCoins);
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    } catch (error) {
      console.error('Error claiming bonus:', error.message);
    }
  };

  const handleRedeemPromocode = async () => {
    if (!promocode.trim()) {
      setPromocodeStatus({ success: false, message: "Please enter a promocode" });
      return;
    }

    try {
      // Check if promocode exists
      const { data: promoData, error: promoError } = await supabase
        .from('promocodes')
        .select('id, code, reward, max_uses, used_count')
        .eq('code', promocode.toLowerCase())
        .single();

      if (promoError || !promoData) {
        setPromocodeStatus({ success: false, message: "Invalid promocode. Please try again." });
        setTimeout(() => setPromocodeStatus(null), 3000);
        return;
      }

      // Check if promocode has been used by this user
      const { data: userPromo, error: userPromoError } = await supabase
        .from('user_promocodes')
        .select('id')
        .eq('user_id', user.id)
        .eq('promocode_id', promoData.id);

      if (userPromoError) throw userPromoError;

      if (userPromo.length > 0) {
        setPromocodeStatus({ success: false, message: "Promocode already used." });
        setTimeout(() => setPromocodeStatus(null), 3000);
        return;
      }

      // Check if promocode has reached max uses
      if (promoData.used_count >= promoData.max_uses) {
        setPromocodeStatus({ success: false, message: "Promocode has reached maximum uses." });
        setTimeout(() => setPromocodeStatus(null), 3000);
        return;
      }

      // Redeem promocode
      const updatedCoins = coins + promoData.reward;

      // Update balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: updatedCoins })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      // Log promocode usage
      const { error: logError } = await supabase
        .from('user_promocodes')
        .insert({
          user_id: user.id,
          promocode_id: promoData.id,
          redeemed_at: new Date().toISOString(),
        });

      if (logError) throw logError;

      // Update used_count
      const { error: countError } = await supabase
        .from('promocodes')
        .update({ used_count: promoData.used_count + 1 })
        .eq('id', promoData.id);

      if (countError) throw countError;

      setCoins(updatedCoins);
      setPromocodeStatus({ success: true, message: `Successfully redeemed ${promoData.reward} coins!` });
      setPromocode("");
      setTimeout(() => setPromocodeStatus(null), 3000);
    } catch (error) {
      console.error('Error redeeming promocode:', error.message);
      setPromocodeStatus({ success: false, message: "Error redeeming promocode. Please try again." });
      setTimeout(() => setPromocodeStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <InGameHeader IsShowGuide={false} />
      
      <main className="container px-4 py-8 max-w-4xl mx-auto">
        <ProfileHeader />

        <Tabs defaultValue="promocodes" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
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
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-500" />
                  Rewards Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Bonuses claimBonus={claimBonus} bonuses={bonuses} />
                <AvailableAds availableAds={availableAds} watchAd={watchAd} />
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setAvailableAds([...availableAds, ...generateMoreAds()])}
                  >
                    Load More Ads
                  </Button>
                </div>
                <SpecialBonuses claimBonus={claimBonus} bonuses={bonuses} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promocodes" className="mt-6">
            <Promocodes 
              promocode={promocode}
              setPromocode={setPromocode}
              promocodeStatus={promocodeStatus}
              setPromocodeStatus={setPromocodeStatus}
              handleRedeemPromocode={handleRedeemPromocode}
              usedPromoCode={bonuses?.promoCodeUsed}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <AdDialog 
        showAdDialog={showAdDialog}
        setShowAdDialog={setShowAdDialog}
        adPlaying={adPlaying}
        currentAd={currentAd}
        adProgress={adProgress}
        claimAdReward={claimAdReward}
      />
      {showConfetti && (
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
      )}
    </div>
  );
}