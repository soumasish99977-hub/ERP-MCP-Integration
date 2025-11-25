export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-linear-to-b from-purple-900 to-purple-700 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">📁 Menu</h1>

      <nav className="space-y-4">
        <a href="/" className="flex items-center gap-2 text-lg hover:text-yellow-300">
          🏠 Home
        </a>
        <a href="/inventory" className="flex items-center gap-2 text-lg hover:text-yellow-300">
          📦 Inventory
        </a>
        <a href="/browse" className="flex items-center gap-2 text-lg hover:text-yellow-300">
          🔍 Browse
        </a>
      </nav>
    </div>
  );
}
