import { useNavigate }from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spade, Coins, Bomb, LoaderPinwheel, Club, Heart} from "lucide-react"

import blackjackImage from "../../components/images/blackjack.jpg";
import scratchImage from "../../components/images/scratch.jpg";
import slotsImage from "../../components/images/slots.jpg";
import texasholdemImage from "../../components/images/texasholdem.jpg";
import plinkoImage from "../../components/images/plinko.jpg";



export default function GameOptions() {
  const navigate = useNavigate(); // Optional: for navigation

  // Define unique functions for each game
  const playBlackjack = () => {
    navigate('/games/blackjack');
  };

  const playTexasHoldEm = () => {
    navigate('/games/texas');
  };

  const playSlots = () => {
    navigate('/games/slots');
  };

  const playScratchTheCard = () => {
    navigate('/games/scratch');
  };

  const playPlinko = () => {
    navigate('/games/plinko');
  };
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <GameCard
        title="Blackjack"
        description="Classic card game against the dealer"
        icon={<Club className="h-5 w-5" />}
        color="#3b82f6"
        bgImage={blackjackImage}
        onPlay={playBlackjack} // Pass the function as a prop
      />
      <GameCard
        title="Slots"
        description="Spin to win with various themes"
        icon={<Coins className="h-5 w-5" />}
        color="#f59e0b"
        bgImage={slotsImage}
        onPlay={playSlots} // Pass the function as a prop
      />
      <GameCard
        title="Scratch The Card"
        description="Reveal all safe cells without hitting bombs"
        icon={<Bomb className="h-5 w-5" />}
        color="#ec4899"
        bgImage={scratchImage}
        onPlay={playScratchTheCard} // Pass the function as a prop
      />
      <GameCard
        title="Plinko"
        description="Drop the ball and enjoy"
        icon={<LoaderPinwheel className="h-5 w-5" />}
        color="#f6793b"
        bgImage={plinkoImage}
        onPlay={playPlinko} // Pass the function as a prop
      />
    </div>
  );
}

// Modern Minimalistic Game Card Component
function GameCard({ title, description, icon, color, bgImage, onPlay }) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm rounded-xl h-full transition-all hover:shadow-md group">
      <CardContent className="p-0">
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
              {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
          </div>

          <p className="text-sm text-[#64748b] mb-4">{description}</p>

          <div className="relative mt-auto aspect-[16/9] rounded-lg overflow-hidden mb-4">
            <img
              src={bgImage}
              alt={title}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: color }}></div>
          </div>

          <Button
            onClick={onPlay} // Call the passed function on click
            className="w-full rounded-lg h-10 text-white transition-colors"
            style={{ backgroundColor: color, borderColor: color }}
          >
            Play Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}