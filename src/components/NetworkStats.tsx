interface NetworkStatsProps {
  stats: {
    gasPrice: string;
    blockNumber: number;
    totalTransactions: number;
    activeAddresses: number;
    difficulty: string;
    hashRate: string;
  } | null;
}

export function NetworkStats({ stats }: NetworkStatsProps) {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Network Statistics</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Network Statistics</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Gas Price:</span>
          <span className="font-medium">{parseInt(stats.gasPrice) / 1e9} Gwei</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Latest Block:</span>
          <span className="font-medium">{stats.blockNumber.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Transactions:</span>
          <span className="font-medium">{stats.totalTransactions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Active Addresses:</span>
          <span className="font-medium">{stats.activeAddresses.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Network Hash Rate:</span>
          <span className="font-medium">{stats.hashRate}</span>
        </div>
      </div>
    </div>
  );
}
