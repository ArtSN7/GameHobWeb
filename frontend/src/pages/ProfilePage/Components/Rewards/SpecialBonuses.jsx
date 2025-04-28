"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "./../../../../lib/supabase";
import { useUser } from "../../../../context/UserContext";

const getBonuses = async () => {
  const { data, error } = await supabase
    .from("special_bonuses")
    .select("*");

  if (error) {
    return [];
  }

  return data;
};

const getBonusesNotUsed = async (userId, all_bonuses) => {
  const { data, error } = await supabase
    .from("user_bonuses")
    .select("special_bonuses_id_array")
    .eq("user_id", userId);

  if (error) {
    return [];
  }

  if (data.length === 0) {
    return all_bonuses;
  }

  const usedBonuses = data[0]?.special_bonuses_id_array || [];
  return all_bonuses.filter(bonus => !usedBonuses.includes(bonus.id));
};

const AddBonusToUser = async (new_array, userId) => {
  const { data: existingUser, error: fetchError } = await supabase
    .from("user_bonuses")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    return false;
  }

  if (existingUser) {
    const { error: updateError } = await supabase
      .from("user_bonuses")
      .update({ special_bonuses_id_array: new_array })
      .eq("user_id", userId);

    if (updateError) {
      return false;
    }
    return true;
  } else {
    const { error: insertError } = await supabase
      .from("user_bonuses")
      .insert({
        user_id: userId,
        special_bonuses_id_array: new_array,
        promo_codes_id_array: [],
        regular_bonuses_id_array: [],
      });

    if (insertError) {
      return false;
    }
    return true;
  }
};

export default function SpecialBonuses({ setShowCon }) {
  const { user, updateBalance, balance, setBalance } = useUser();
  const [bonuses, setBonuses] = useState([]);

  useEffect(() => {
    const fetchBonuses = async () => {
      const all_bonuses = await getBonuses();
      const userId = user.id;
      const unusedBonuses = await getBonusesNotUsed(userId, all_bonuses);
      setBonuses(unusedBonuses);
    };

    if (user) {
      fetchBonuses();
    }
  }, [user]);

  const claimBonus = async (bonus) => {
    const { data: user_data, error } = await supabase
      .from("user_bonuses")
      .select("special_bonuses_id_array")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user bonuses:", error);
      return;
    }

    const specialBonusesArray = user_data[0]?.special_bonuses_id_array || [];
    const updatedBonusesArray = [...specialBonusesArray, bonus.id];

    const success = await AddBonusToUser(updatedBonusesArray, user.id);
    if (success) {
      setBonuses(bonuses.filter(b => b.id !== bonus.id));
      setShowCon(true);
      const newBalance = balance + bonus.price;
      setBalance(newBalance);
      await updateBalance(newBalance);
    }
  };

  return (
    <div className="transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        Special Bonuses
      </h3>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4"> {/* Reduced padding from p-6 to p-4 */}
          {bonuses.length === 0 ? (
            <div className="text-center py-4"> {/* Reduced from py-8 to py-4 */}
              <Gift className="h-8 w-8 text-yellow-400 mx-auto mb-2 animate-bounce" /> {/* Reduced icon size from h-12 w-12 to h-8 w-8 */}
              <p className="text-gray-600 text-sm mb-1">No special bonuses available</p> {/* Reduced text size and margin */}
              <p className="text-xs text-gray-500">Check back for new rewards!</p> {/* Reduced text size */}
            </div>
          ) : (
            <div className="space-y-4">
              {bonuses.map(bonus => (
                <div
                  key={bonus.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-yellow-500" />
                    <div>
                      <span className="font-medium text-gray-800">{bonus.title}</span>
                      <span className="text-sm text-gray-600 ml-2">+{bonus.price} Coins</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => claimBonus(bonus)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
                  >
                    Claim Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}