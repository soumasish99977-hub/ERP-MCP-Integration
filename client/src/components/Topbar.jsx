export default function Topbar() {
  const currentTime = new Date().toLocaleString();

  return (
    <div className="w-full bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between shadow">
      
      {/* Left Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Global Inventory Intelligence
        </h1>
        <p className="text-gray-400 text-sm">
          Interactive inventory browser — filter by category, state, city and warehouse
        </p>
      </div>

      {/* Right Info Section */}
      <div className="text-right">
        <p className="text-sm text-gray-300">As of: {currentTime}</p>
      </div>
    </div>
  );
}
