import type React from "react"

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 rounded-xl overflow-hidden shadow-lg border border-zinc-700/20 animate-pulse">
      <div className="aspect-video bg-zinc-700/50 relative">
        {/* Badges skeletons */}
        <div className="absolute top-2 left-2 h-6 w-20 bg-zinc-600/50 rounded-full"></div>
        <div className="absolute top-2 right-2 h-6 w-14 bg-zinc-600/50 rounded-full"></div>
      </div>

      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-5 bg-zinc-700/50 rounded mb-3"></div>

        {/* Info row skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 w-20 bg-zinc-700/50 rounded-md"></div>
          <div className="h-6 w-10 bg-zinc-700/50 rounded-md"></div>
          <div className="h-8 w-8 bg-zinc-700/50 rounded-full"></div>
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-zinc-700/30 p-2 rounded-lg">
            <div className="h-3 w-24 bg-zinc-600/50 rounded mb-2"></div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-zinc-600/50 rounded"></div>
              <div className="h-6 w-14 bg-zinc-600/50 rounded"></div>
            </div>
          </div>
          <div className="bg-zinc-700/30 p-2 rounded-lg">
            <div className="h-3 w-24 bg-zinc-600/50 rounded mb-2"></div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-zinc-600/50 rounded"></div>
              <div className="h-6 w-14 bg-zinc-600/50 rounded"></div>
            </div>
          </div>
        </div>

        {/* Tags skeleton */}
        <div className="mt-3 pt-3 border-t border-zinc-700/30">
          <div className="flex flex-wrap gap-1.5">
            <div className="h-5 w-20 bg-zinc-700/50 rounded"></div>
            <div className="h-5 w-16 bg-zinc-700/50 rounded"></div>
            <div className="h-5 w-24 bg-zinc-700/50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

