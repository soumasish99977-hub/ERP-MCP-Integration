import React, { useState } from "react";
import Topbar from "../components/Topbar";
import DataTable from "../components/DataTable";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    "ItemID",
    "ItemName",
    "Category",
    "Quantity",
    "Warehouse",
    "City",
    "State/Province",
    "Country",
  ];

  const data = [
    {
      ItemID: "ITM0001",
      ItemName: "Apple",
      Category: "Food",
      Quantity: 636,
      Warehouse: "Warehouse B-AUS",
      City: "Sydney",
      State: "NSW",
      Country: "Australia",
    },
    {
      ItemID: "ITM0002",
      ItemName: "Bookshelf",
      Category: "Furniture",
      Quantity: 170,
      Warehouse: "Warehouse B-UK",
      City: "London",
      State: "England",
      Country: "UK",
    },
  ];

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0f1f] to-black text-white p-6">
      <Topbar title="Inventory Browser (Current Stock)" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <select className="bg-[#101827] p-4 rounded-xl border border-gray-700">
          <option>All Countries</option>
        </select>

        <select className="bg-[#101827] p-4 rounded-xl border border-gray-700">
          <option>All States + Cities</option>
        </select>

        <select className="bg-[#101827] p-4 rounded-xl border border-gray-700">
          <option>All Warehouses</option>
        </select>

        <select className="bg-[#101827] p-4 rounded-xl border border-gray-700">
          <option>All Categories</option>
        </select>
      </div>

      <div className="mt-4">
        <button className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold">
          Reset
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
        <div className="bg-[#101827] p-6 rounded-xl shadow-lg text-center">
          <p className="text-sm text-gray-400">Distinct Items</p>
          <h2 className="text-3xl font-bold text-yellow-400">40</h2>
        </div>

        <div className="bg-[#101827] p-6 rounded-xl shadow-lg text-center">
          <p className="text-sm text-gray-400">Total Quantity</p>
          <h2 className="text-3xl font-bold text-yellow-400">148,026</h2>
        </div>

        <div className="bg-[#101827] p-6 rounded-xl shadow-lg text-center">
          <p className="text-sm text-gray-400">Locations</p>
          <h2 className="text-3xl font-bold text-yellow-400">35</h2>
        </div>

        <div className="bg-[#101827] p-6 rounded-xl shadow-lg text-center">
          <p className="text-sm text-gray-400">Warehouses</p>
          <h2 className="text-3xl font-bold text-yellow-400">28</h2>
        </div>
      </div>

      {/* Results Title */}
      <h2 className="mt-12 text-2xl font-semibold flex items-center gap-2">
        📄 Results
      </h2>

      {/* Search Bar */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="🔍 Quick search"
          className="w-full p-4 bg-[#101827] rounded-xl border border-gray-700 outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <div className="mt-8">
        <DataTable columns={columns} data={filteredData} />
      </div>

      {/* Download Button */}
      <div className="mt-10">
        <button className="px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-black font-semibold rounded-xl shadow-lg hover:opacity-90">
          Download filtered CSV
        </button>
      </div>
    </div>
  );
};

export default Inventory;