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

export default function Promocodes({ setShowConfetti }) {
  const [promocode, setPromocode] = useState("")
  const [promocodeStatus, setPromocodeStatus] = useState(false)
  const [promocodeStatusSuccess, setPromocodeStatusSuccess] = useState(false)
  const [promocodeData, setPromocodeData] = useState(null)
  const { updateBalance, balance, setBalance} = useUser()

  useEffect(() => {
    if (promocodeStatus) {
      const timer = setTimeout(() => {
        setPromocodeStatus(false)
        setPromocodeStatusSuccess(false)
        setPromocodeData(null)
      }, 5000) // Message disappears after 5 seconds
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
      return
    } else {
      setPromocodeStatusSuccess(true)
      setPromocodeStatus(true)
      setPromocodeData(foundPromocode)
      // Update balance with promocode value
      setBalance(balance + foundPromocode.price)
      await updateBalance(balance)
    }

    //setShowConfetti(true)
  }

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