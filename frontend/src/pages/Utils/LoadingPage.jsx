export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333]">

      <main className="container px-4 py-8 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-6 p-4 bg-blue-50 rounded-full">
            {/* Simple CSS-based loading spinner */}
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <h1 className="text-3xl font-bold text-[#333333] mb-4">Loading...</h1>

          <p className="text-[#666666] mb-8 max-w-sm">Please wait while we fetch your content.</p>
        </div>
      </main>
    </div>
  );
}