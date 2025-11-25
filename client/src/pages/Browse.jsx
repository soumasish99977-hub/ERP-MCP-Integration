import React, { useState } from "react";

const Browse = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen w-full bg-[#0a0f1f] text-white p-10">

      {/* Title Section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text 
          bg-linear-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
          Global Inventory Intelligence
        </h1>

        <p className="text-gray-300 mb-10 text-sm">
          Interactive inventory browser — filter by category, state, city and warehouse
        </p>
      </div>

      {/* Browse Title */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
          <span className="text-blue-300 text-3xl">🔍</span>
          Browse Inventory by ItemName (Current Stock)
        </h2>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Type an item name"
          className="w-full px-4 py-3 rounded-xl bg-[#11172a] border border-gray-700 
          text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Browse;