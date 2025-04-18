"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"

import { supabase } from "./../../../../lib/supabase";
import { useUser } from "../../../../context/UserContext"


const getPromocodes = async () => {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")

  if (error) {
    return []
  }

  return data
}

const AddPromoToUser = async (new_array, userId) => {
  // Check if the user exists in the user_bonuses table
  const { data: existingUser, error: fetchError } = await supabase
    .from("user_bonuses")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle(); // Use maybeSingle to handle no rows case

  if (fetchError) {
    return false;
  }

  if (existingUser) {
    // User exists, update the promo_codes_id_array
    const { error: updateError } = await supabase
      .from("user_bonuses")
      .update({ promo_codes_id_array: new_array })
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
        promo_codes_id_array: new_array,
        regular_bonuses_id_array: [], // Initialize other arrays as empty
        special_bonuses_id_array: [], // Initialize other arrays as empty
      });

    if (insertError) {
      return false;
    }
    return true;
  }
}

export default function Promocodes({ setShowConfetti }) {
  const [promocode, setPromocode] = useState("")
  const [promocodeStatus, setPromocodeStatus] = useState(false)
  const [promocodeStatusSuccess, setPromocodeStatusSuccess] = useState(false)
  const [promocodeData, setPromocodeData] = useState(null)
  const { updateBalance, balance, setBalance, user } = useUser()
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    if (promocodeStatus) {
      const timer = setTimeout(() => {
        setPromocodeStatus(false)
        setPromocodeStatusSuccess(false)
        setPromocodeData(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [promocodeStatus])

  const handleRedeemPromocode = async () => {
    // Fetch promocodes from the database
    const promocodes = await getPromocodes();

    // Find the promocode in the database
    const foundPromocode = promocodes.find((code) => code.code === promocode);

    // If promocode doesn't exist, show error
    if (!foundPromocode) {
      setPromocodeStatus(true);
      setPromocodeStatusSuccess(false);
      setPromocodeData(null);
      setIsValid(false);
      return;
    }

    // Fetch user's promo_codes_id_array
    const { data: user_data, error } = await supabase
      .from("user_bonuses")
      .select("promo_codes_id_array")
      .eq("user_id", user.id);

    if (error) {
      setPromocodeStatus(true);
      setPromocodeStatusSuccess(false);
      setPromocodeData(null);
      setIsValid(false);
      return;
    }

    // Check if user has already used this promocode
    const promoCodesArray = user_data[0]?.promo_codes_id_array || [];
    if (promoCodesArray.includes(foundPromocode.id)) {
      setPromocodeStatus(true);
      setPromocodeStatusSuccess(false);
      setPromocodeData(null);
      setIsValid(false);
      return;
    }

    // Promocode is valid and not used, proceed with redemption
    setPromocodeStatus(true);
    setPromocodeStatusSuccess(true);
    setPromocodeData(foundPromocode);

    // Update balance
    const newBalance = balance + foundPromocode.price;
    setBalance(newBalance);
    await updateBalance(newBalance);

    // Show confetti
    setShowConfetti(true);

    // Add promocode ID to user's promo_codes_id_array
    const updatedPromoCodesArray = [...promoCodesArray, foundPromocode.id];
    await AddPromoToUser(updatedPromoCodesArray, user.id);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Redeem Promocode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[#64748b]">
          Enter a valid promocode to receive bonus coins or special rewards.
        </p>

        {promocodeStatus && (
          <Alert
            variant={promocodeStatusSuccess ? "default" : "destructive"}
            className={promocodeStatusSuccess ? "bg-green-50 border-green-200 text-green-800" : ""}
          >
            {promocodeStatusSuccess ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}

            {promocodeStatusSuccess && promocodeData ? (
              <AlertDescription>{`Promocode-${promocodeData.name} applied! You got ${promocodeData.price} coins!`}</AlertDescription>
            ) : (
              <AlertDescription>{"Invalid promocode!"}</AlertDescription>
            )}
          </Alert>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter promocode"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
            />
          </div>
          <Button 
            className="bg-blue-500 hover:bg-blue-600" 
            onClick={handleRedeemPromocode}
          >
            Redeem
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}