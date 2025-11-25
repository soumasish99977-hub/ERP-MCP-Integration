import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";

const inventoryData = [
  { Item: "Rice", Quantity: 120 },
  { Item: "Laptop", Quantity: 8 },
  { Item: "Chair", Quantity: 0 },
  { Item: "Monitor", Quantity: 5 },
  { Item: "Desk", Quantity: 25 }
];

const Home = () => {
  const [stockSummary, setStockSummary] = useState({
    available: 0,
    low: 0,
    out: 0
  });

  useEffect(() => {
    const available = inventoryData.filter((i) => i.Quantity > 10).length;
    const low = inventoryData.filter((i) => i.Quantity > 0 && i.Quantity <= 10).length;
    const out = inventoryData.filter((i) => i.Quantity === 0).length;
    setStockSummary({ available, low, out });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Topbar title="Global Inventory Intelligence" />

      {/* TOP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ChartCard title="Top Selling Items">
          <BarChart />
        </ChartCard>

        <ChartCard title="Recent Inventory">
          <DataTable
            columns={["Item", "Quantity"]}
            data={inventoryData}
          />
        </ChartCard>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ChartCard title="Stock Availability">
          <PieChart
            labels={["Available", "Running Out", "Out of Stock"]}
            data={[
              stockSummary.available,
              stockSummary.low,
              stockSummary.out
            ]}
          />
        </ChartCard>

        <ChartCard title="Warehouse Capacity">
          <PieChart />
        </ChartCard>
      </div>
    </div>
  );
};

export default Home;
