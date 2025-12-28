import React, { useState } from 'react';
import { Search, FileText, Folder, Image, Music, Film, File, Dog } from 'lucide-react';

const mockResults = [
  { name: 'Resume.doc', path: 'C:\\My Documents\\', icon: FileText, size: '24 KB' },
  { name: 'Cover Letter.doc', path: 'C:\\My Documents\\', icon: FileText, size: '18 KB' },
  { name: 'vacation_photo.jpg', path: 'C:\\My Documents\\My Pictures\\', icon: Image, size: '1.2 MB' },
  { name: 'birthday_party.jpg', path: 'C:\\My Documents\\My Pictures\\', icon: Image, size: '890 KB' },
  { name: 'favorite_song.mp3', path: 'C:\\My Documents\\My Music\\', icon: Music, size: '4.5 MB' },
  { name: 'funny_video.avi', path: 'C:\\My Documents\\', icon: Film, size: '15 MB' },
  { name: 'notes.txt', path: 'C:\\Desktop\\', icon: File, size: '2 KB' },
];

const SearchApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockResults>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setResults(mockResults.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar with dog */}
      <div className="w-56 bg-gradient-to-b from-blue-50 to-blue-100 border-r p-4">
        <div className="text-center mb-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center mb-2 shadow-lg">
            <Dog className="w-12 h-12 text-yellow-700" />
          </div>
          <p className="text-sm font-bold text-gray-700">Search Companion</p>
          <p className="text-xs text-gray-500">Hi! I'm here to help you find files.</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Search for:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="All or part of file name"
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-gradient-to-b from-blue-500 to-blue-600 text-white py-1.5 rounded text-sm font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>

          <div className="pt-2 border-t text-xs space-y-1">
            <div className="text-blue-600 hover:underline cursor-pointer">Pictures, music, or video</div>
            <div className="text-blue-600 hover:underline cursor-pointer">Documents</div>
            <div className="text-blue-600 hover:underline cursor-pointer">All files and folders</div>
            <div className="text-blue-600 hover:underline cursor-pointer">Computers or people</div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-2 bg-gray-100 border-b flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            {results.length > 0 
              ? `Found ${results.length} result(s)` 
              : 'Enter a search term to find files'}
          </span>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {isSearching ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-2 py-1.5 hover:bg-blue-100 cursor-pointer rounded"
                >
                  <result.icon className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{result.name}</div>
                    <div className="text-xs text-gray-500">{result.path}</div>
                  </div>
                  <span className="text-xs text-gray-500">{result.size}</span>
                </div>
              ))}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="text-center py-8 text-gray-500">
              <p>No files found matching "{searchQuery}"</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchApp;