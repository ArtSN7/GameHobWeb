
import { Button } from "@/components/ui/button";
import {  Plus, Minus } from "lucide-react";

import { useUser } from "@/context/UserContext";


// pass RUNNING instead of a gameState ( when the game is in progress ) in parent components
export default function BettingInput({ bet, setBet,  gameState }) {

    const { balance } = useUser();

    // Increase bet
    const increaseBet = () => {
        if (gameState === "RUNNING") return;
        setBet(Math.min(bet + 100, balance));
    };

    // Decrease bet
    const decreaseBet = () => {
        if (gameState === "RUNNING") return;
        setBet(Math.max(bet - 100, 100));
    };

    const handleBetInput = (e) => {
        if (gameState === "RUNNING") return;
        const value = Number(e.target.value);
        setBet(Math.max(0, Math.min(value, balance)));
      };

    return (
        <div className="mb-6">
            <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
                <div className="flex items-center justify-between w-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={decreaseBet}
                        disabled={bet <= 100 || gameState === "RUNNING"}
                        className="h-10 w-10 rounded-full text-[#666666] hover:text-blue-500 hover:bg-blue-50"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={bet || ""}
                        onChange={handleBetInput}
                        className="w-20 text-center text-xl font-medium border border-gray-300 rounded-md p-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        disabled={gameState === "RUNNING"}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={increaseBet}
                        disabled={bet >= balance || gameState === "RUNNING"}
                        className="h-10 w-10 rounded-full text-[#666666] hover:text-blue-500 hover:bg-blue-50"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}