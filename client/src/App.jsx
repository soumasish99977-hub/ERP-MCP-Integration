import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Browse from "./pages/Browse";  // <-- Added back

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 bg-black min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/browse" element={<Browse />} /> {/* <-- This enables Browse */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;