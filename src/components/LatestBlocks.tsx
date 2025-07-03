interface Block {
  _id: string;
  number: number;
  hash: string;
  timestamp: number;
  transactionCount: number;
  gasUsed: string;
  miner: string;
  reward: string;
}

interface LatestBlocksProps {
  blocks: Block[];
}

export function LatestBlocks({ blocks }: LatestBlocksProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Latest Blocks</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {blocks.map((block) => (
          <div key={block._id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <a href={`/block/${block.number}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {block.number}
                    </a>
                    <span className="text-gray-500 text-sm">
                      {Math.floor((Date.now() - block.timestamp) / 1000)}s ago
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-mono">{block.hash.slice(0, 20)}...</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {block.transactionCount} txns
                </div>
                <div className="text-sm text-gray-600">
                  {(parseInt(block.gasUsed) / 1e6).toFixed(2)}M gas
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-gray-50 text-center">
        <a href="/blocks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View all blocks →
        </a>
      </div>
    </div>
  );
}
