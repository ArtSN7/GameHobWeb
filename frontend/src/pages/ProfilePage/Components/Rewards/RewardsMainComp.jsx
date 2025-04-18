"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  TabsContent,  } from "@/components/ui/tabs";
import { Gift,} from "lucide-react";
import { useEffect, useState } from "react";


import Bonuses from "./Bonuses";




export default function RewardsMainComp({setShowConfetti}) {


    return(

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-blue-500" />
              Rewards Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Bonuses setShowCon={setShowConfetti}  />

            {/*

                <SpecialBonuses />

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

            */}

          </CardContent>
        </Card>

    );

};