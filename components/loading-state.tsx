import type React from "react"

export const LoadingState: React.FC = () => {
  return (
    <div 
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white font-sans items-center justify-center"
      suppressHydrationWarning={true}
      data-suppress-hydration-warning="true"
    >
      <div 
        className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"
        suppressHydrationWarning={true}
        data-suppress-hydration-warning="true"
      ></div>
      <p className="mt-4 text-gray-400">Carregando anúncio...</p>
    </div>
  )
}

