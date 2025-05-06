"use client";

export function EngagementChart() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">Engagement</h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-semibold text-white">2.4k</span>
          <div className="h-12 w-12 rounded-lg bg-[#222] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-purple-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-8 8" />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500">253 contributions in the last year</p>
      
      {/* Chart */}
      <div className="relative h-12">
        <div className="absolute inset-0 flex items-end space-x-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-500/20 to-purple-500"
              style={{
                height: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 