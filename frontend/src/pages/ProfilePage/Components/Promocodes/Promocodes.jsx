"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, AlertCircle, Tag } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "./../../../../lib/supabase"
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
  const { data: existingUser, error: fetchError } = await supabase
    .from("user_bonuses")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError) {
    return false
  }

  if (existingUser) {
    const { error: updateError } = await supabase
      .from("user_bonuses")
      .update({ promo_codes_id_array: new_array })
      .eq("user_id", userId)

    if (updateError) {
      return false
    }
    return true
  } else {
    const { error: insertError } = await supabase
      .from("user_bonuses")
      .insert({
        user_id: userId,
        promo_codes_id_array: new_array,
        regular_bonuses_id_array: [],
        special_bonuses_id_array: [],
      })

    if (insertError) {
      return false
    }
    return true
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
    const promocodes = await getPromocodes()
    const foundPromocode = promocodes.find((code) => code.code === promocode)

    if (!foundPromocode) {
      setPromocodeStatus(true)
      setPromocodeStatusSuccess(false)
      setPromocodeData(null)
      setIsValid(false)
      return
    }

    const { data: user_data, error } = await supabase
      .from("user_bonuses")
      .select("promo_codes_id_array")
      .eq("user_id", user.id)

    if (error) {
      setPromocodeStatus(true)
      setPromocodeStatusSuccess(false)
      setPromocodeData(null)
      setIsValid(false)
      return
    }

    const promoCodesArray = user_data[0]?.promo_codes_id_array || []
    if (promoCodesArray.includes(foundPromocode.id)) {
      setPromocodeStatus(true)
      setPromocodeStatusSuccess(false)
      setPromocodeData(null)
      setIsValid(false)
      return
    }

    setPromocodeStatus(true)
    setPromocodeStatusSuccess(true)
    setPromocodeData(foundPromocode)

    const newBalance = balance + foundPromocode.price
    setBalance(newBalance)
    await updateBalance(newBalance)

    setShowConfetti(true)

    const updatedPromoCodesArray = [...promoCodesArray, foundPromocode.id]
    await AddPromoToUser(updatedPremiumCodesArray, user.id)
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
          <Tag className="h-5 w-5 text-purple-500" />
          Redeem Promocode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <p className="text-gray-600 text-sm leading-relaxed">
          Enter a valid promocode to unlock bonus coins or exclusive rewards!
        </p>

        {promocodeStatus && (
          <Alert
            variant={promocodeStatusSuccess ? "default" : "destructive"}
            className={`animate-in fade-in duration-300 ${
              promocodeStatusSuccess
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {promocodeStatusSuccess ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {promocodeStatusSuccess && promocodeData ? (
                <>
                  Success! Promocode <span className="font-semibold">{promocodeData.name}</span> applied. 
                  You received <span className="font-semibold">{promocodeData.price}</span> coins!
                </>
              ) : (
                "Invalid or already used promocode. Please try another."
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter promocode"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200 h-11 rounded-lg"
            />
          </div>
          <Button
            onClick={handleRedeemPromocode}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Redeem Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}