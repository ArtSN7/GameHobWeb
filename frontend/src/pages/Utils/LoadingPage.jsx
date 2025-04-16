import { Loader } from "lucide-react"

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333]">

      <main className="container px-4 py-8 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-6 p-4 bg-blue-50 rounded-full">
            <Loader className="h-12 w-12 text-blue-500" />
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-4">Loading</h1>
        </div>
      </main>
    </div>
  );
}