export default function SkeletonDialog() {
  return (
    <div className="bg-white w-full flex flex-col min-h-0">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-orange-300 animate-pulse"></div>
        <div className="relative px-3 sm:px-5 py-4">
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-orange-100 animate-pulse"></div>
                <div className="h-5 w-40 bg-orange-100 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <div className="h-4 w-24 bg-orange-100 rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-orange-100 rounded-full animate-pulse sm:ml-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-b w-full flex-shrink-0">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="p-3 border-r-0 sm:border-r border-b sm:border-b-0 lg:border-b-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded bg-orange-200 animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="px-3 sm:px-4 py-3 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-orange-100 rounded-full animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="flex-1 min-h-0">
          <div className="h-full rounded-lg border border-orange-100 shadow-sm overflow-hidden">
            {/* Table Header Skeleton */}
            <div className="bg-orange-50 p-3 border-b">
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                  <div
                    key={col}
                    className="h-3 bg-orange-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Table Rows Skeleton */}
            <div className="bg-white">
              {[1, 2, 3].map((row) => (
                <div key={row} className="p-3 border-b border-orange-100">
                  <div className="grid grid-cols-7 gap-2 items-center">
                    <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-18 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-green-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-green-300 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-t flex-shrink-0">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 gap-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-green-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
