// components of the main page
import Header from "../Utils/Header"
import Footer from "../Utils/Footer"
import BalanceComponent from "./BalanceComponent"
import GameOptions from "./GameOptions"

import {useUser} from "@/context/UserContext";

import { useNavigate } from "react-router-dom";
import LoadingPage from "../Utils/LoadingPage";
import { use, useEffect } from "react";


export default function HomePage() {

  const navigate = useNavigate();

  const { user, profile, isAuthenticated, isLoading, updateBalance } = useUser();

  useEffect(() => {
    if (isLoading) {
      return <LoadingPage />;
    }
  }, [isLoading]);




  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">

      {/* Header */}
      <Header />

      
      {/* Main Content */}
      <main className="container px-4 py-8">

        {/* Balance Section */}
        <BalanceComponent />


        {/* Games Section */}
        <section className="mb-12">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Games</h2>
          </div>

          <GameOptions />

        </section>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  )
}

