import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { supabase } from "./../../../../lib/supabase";
import { useUser } from "../../../../context/UserContext"

const getBonuses = async () => {
  const { data, error } = await supabase
    .from("regular_bonuses")
    .select("*");

  if (error) {
    return [];
  }

  return data;
};

const getBonusesNotUsed = async (userId, all_bonuses) => {
  const { data, error } = await supabase
    .from("user_bonuses")
    .select("regular_bonuses_id_array")
    .eq("user_id", userId);

  if (error) {
    return [];
  }

  if (data.length === 0) {
    return all_bonuses;
  }

  const usedBonuses = data[0]?.regular_bonuses_id_array || [];
  return all_bonuses.filter(bonus => !usedBonuses.includes(bonus.id));
};

const AddBonusToUser = async (new_array, userId) => {
  // Check if the user exists in the user_bonuses table
  const { data: existingUser, error: fetchError } = await supabase
    .from("user_bonuses")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    return false;
  }

  if (existingUser) {
    // User exists, update the regular_bonuses_id_array
    const { error: updateError } = await supabase
      .from("user_bonuses")
      .update({ regular_bonuses_id_array: new_array })
      .eq("user_id", userId);

    if (updateError) {
      return false;
    }
    return true;
  } else {
    // User doesn't exist, insert a new row
    const { error: insertError } = await supabase
      .from("user_bonuses")
      .insert({
        user_id: userId,
        regular_bonuses_id_array: new_array,
        promo_codes_id_array: [], // Initialize other arrays as empty
        special_bonuses_id_array: [], // Initialize other arrays as empty
      });

    if (insertError) {
      return false;
    }
    return true;
  }
};

export default function Bonuses({setShowCon}) {
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
    // Fetch the current regular_bonuses_id_array
    const { data: user_data, error } = await supabase
      .from("user_bonuses")
      .select("regular_bonuses_id_array")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user bonuses:", error);
      return;
    }

    const regularBonusesArray = user_data[0]?.regular_bonuses_id_array || [];
    const updatedBonusesArray = [...regularBonusesArray, bonus.id];

    // Add the bonus to the user's regular_bonuses_id_array
    const success = await AddBonusToUser(updatedBonusesArray, user.id);
    if (success) {
      // Update the local state to reflect the claimed bonus
      setBonuses(bonuses.filter(b => b.id !== bonus.id));
      setShowCon(true); // Show confetti animation
      const newBalance = balance + bonus.price;
      setBalance(newBalance);
      await updateBalance(newBalance);
  
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Daily & Weekly Bonuses</h3>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          {bonuses.length === 0 ? (
            <p>No bonuses available to claim.</p>
          ) : (
            bonuses.map(bonus => (
              <div key={bonus.id} className="flex justify-between items-center">
                <span>{bonus.title} - {bonus.price} Coins</span>
                <Button
                  onClick={() => claimBonus(bonus)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Claim
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}