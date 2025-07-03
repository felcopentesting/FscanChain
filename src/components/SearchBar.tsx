import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const searchResults = useQuery(
    api.blockchain.searchTransactions,
    query.length > 2 ? {
      query,
      paginationOpts: { numItems: 5, cursor: null }
    } : "skip"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(e.target.value.length > 2);
            }}
            onFocus={() => setIsOpen(query.length > 2)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder="Search by Address / Txn Hash / Block / Token"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            style={{ minWidth: '400px' }}
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && searchResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            {searchResults.page.length > 0 ? (
              searchResults.page.map((result) => (
                <a
                  key={result._id}
                  href={`/tx/${result.hash}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">
                      {result.hash.slice(0, 20)}...
                    </span>
                    <span className="text-gray-500">
                      Block {result.blockNumber}
                    </span>
                  </div>
                </a>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
