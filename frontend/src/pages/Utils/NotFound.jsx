import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333]">

      <main className="container px-4 py-8 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-6 p-4 bg-blue-50 rounded-full">
            <Search className="h-12 w-12 text-blue-500" />
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-4">Page Not Found</h1>

          <p className="text-[#666666] mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>

          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-2 rounded-xl text-white font-medium">
              Return back
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}