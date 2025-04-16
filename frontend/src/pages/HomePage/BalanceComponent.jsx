import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { useState, useEffect } from "react";
import {useUser} from "@/context/UserContext";


export default function BalanceComponent() {

  const { profile, isAuthenticated, isLoading } = useUser();
  const [error, setError] = useState(null);

  if (!isAuthenticated || !profile) {
    return null;
  }


  if (isLoading) {
    return (
      <section className="mb-12">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-[#64748b] mb-1">Your Balance</h2>
                <p className="text-lg text-[#333333]">...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-[#64748b] mb-1">Your Balance</h2>
                <p className="text-lg text-red-500">{"Unable to load your balance now"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#64748b] mb-1">Your Balance</h2>
              <p className="text-3xl font-bold flex items-center">
                <Coins className="h-5 w-5 mr-2 text-blue-500" />
                {profile.balance}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}