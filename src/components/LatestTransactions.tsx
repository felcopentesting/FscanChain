interface Transaction {
  _id: string;
  hash: string;
  blockNumber: number;
  from: string;
  to?: string;
  value: string;
  timestamp: number;
  gasUsed?: string;
  status?: number;
}

interface LatestTransactionsProps {
  transactions: Transaction[];
}

export function LatestTransactions({ transactions }: LatestTransactionsProps) {
  const formatValue = (value: string) => {
    const eth = parseFloat(value) / 1e18;
    if (eth === 0) return '0';
    if (eth < 0.001) return '<0.001';
    return eth.toFixed(4);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Latest Transactions</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.map((tx) => (
          <div key={tx._id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.status === 1 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      tx.status === 1 ? 'text-green-600' : 'text-red-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <a href={`/tx/${tx.hash}`} className="text-blue-600 hover:text-blue-800 font-mono text-sm">
                      {tx.hash.slice(0, 20)}...
                    </a>
                    <span className="text-gray-500 text-sm">
                      {Math.floor((Date.now() - tx.timestamp) / 1000)}s ago
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-mono">{tx.from.slice(0, 10)}...</span>
                    <span className="mx-2">→</span>
                    <span className="font-mono">{tx.to?.slice(0, 10) || 'Contract'}...</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {formatValue(tx.value)} ETH
                </div>
                <div className="text-sm text-gray-600">
                  Block {tx.blockNumber}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-gray-50 text-center">
        <a href="/txs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View all transactions →
        </a>
      </div>
    </div>
  );
}
