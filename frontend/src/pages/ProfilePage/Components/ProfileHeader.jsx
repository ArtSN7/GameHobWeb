import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Trophy, LogOut } from "lucide-react" // Added LogOut icon
import { useUser } from "../../../context/UserContext"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { useState } from "react" // Added for loading state

export default function ProfileHeader() {
    const { user, profile, isLoading, logout } = useUser()
    const navigate = useNavigate()
    const [isLoggingOut, setIsLoggingOut] = useState(false) // Added loading state

    if (isLoading || profile === null) {
        return null
    }

    const handle_logout = async () => {
        try {
            setIsLoggingOut(true)
            await logout()
            navigate("/auth/login")
        } catch (error) {
            console.error("Logout failed:", error.message)
        } finally {
            setIsLoggingOut(false)
        }
    }

    const formattedDate = format(new Date(profile.created_at), "EEEE d MMMM yyyy")

    return (
        <Card className="border-0 shadow-sm mb-8">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        <img
                            src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${profile.email}?height=40&width=40`}
                            alt="Profile"
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-blue-500 object-cover"
                        />
                        <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold mb-1">{profile.email}</h1>
                        <p className="text-[#64748b] mb-4">Member since: {formattedDate}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-1.5">
                                <Trophy className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">Level {profile.level}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handle_logout}
                        disabled={isLoggingOut}
                        className={`
                            flex items-center gap-2
                            px-4 py-2
                            bg-red-500 text-white
                            rounded-md
                            font-medium
                            transition-all duration-200
                            hover:bg-red-600
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${isLoggingOut ? 'animate-pulse' : ''}
                        `}
                        aria-label="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}