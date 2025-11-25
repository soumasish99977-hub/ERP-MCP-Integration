import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Papa from "papaparse";
import * as XLSX from "xlsx";

// InventoryDashboardHome.jsx
// Single-file React + Tailwind component that implements the Streamlit dashboard
// behavior from your provided code. Replace placeholder functions with real
// backend calls as needed.

export default function InventoryDashboardHome({ initialInventory = [] }) {
  // ---- State ----
  const [invData, setInvData] = useState(initialInventory);
  const [workingDF, setWorkingDF] = useState(null); // equivalent to st.session_state.working_df
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
  const [latestUploadInfo, setLatestUploadInfo] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dashboardUpdateRequired, setDashboardUpdateRequired] = useState(false);
  const fileInputRef = useRef(null);

  // ---- Effects ----
  useEffect(() => {
    // Example: if initialInventory passed, convert numeric fields
    if (Array.isArray(initialInventory) && initialInventory.length) {
      const normalized = initialInventory.map((r) => ({
        ...r,
        Quantity: Number(r.Quantity) || 0,
      }));
      setInvData(normalized);
    }
  }, [initialInventory]);

  useEffect(() => {
    if (dashboardUpdateRequired) {
      setDashboardUpdateRequired(false);
      setLastUpdated(new Date().toLocaleString());
    }
  }, [dashboardUpdateRequired]);

  // ---- Helpers ----
  function bytesToDownload(data, filename, mime) {
    const blob = new Blob([data], { type: mime || "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploadStatus({ type: "loading", message: `Processing ${file.name}...` });

    const ext = file.name.split(".").pop().toLowerCase();

    try {
      if (["csv"].includes(ext)) {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        // flattened rows
        setWorkingDF(parsed.data);
        const status = processSalesAndUpdateInventory(parsed.data, file.name);
        setUploadStatus({ type: "success", message: status });
      } else if (["xlsx", "xls"].includes(ext)) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
        setWorkingDF(json);
        const status = processSalesAndUpdateInventory(json, file.name);
        setUploadStatus({ type: "success", message: status });
      } else if (["pdf", "docx"].includes(ext)) {
        setUploadStatus({ type: "warning", message: `File ${file.name} uploaded but processing for pdf/docx is not supported. Use CSV/XLSX.` });
        setLatestUploadInfo(null);
      } else {
        setUploadStatus({ type: "error", message: `Unsupported file type: .${ext}. Please use CSV or XLSX.` });
        setLatestUploadInfo(null);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus({ type: "error", message: `Error processing file: ${err.message}` });
      setLatestUploadInfo(null);
    }
  }

  // This function mimics your Python process_sales_and_update_inventory
  // - salesRows: array of rows from CSV/XLSX
  // - fileName: string
  // It returns a status message and updates invData state accordingly (client-side only)
  function processSalesAndUpdateInventory(salesRows, fileName) {
    if (!Array.isArray(salesRows) || salesRows.length === 0) {
      return `Error: No sales rows detected in ${fileName}`;
    }

    // Expect columns: ItemID or ItemName, QuantitySold (or Quantity) -- be forgiving
    const sales = salesRows
      .map((r) => {
        const name = r.ItemName || r.itemname || r.item || r["Item Name"] || "";
        const qty = Number(r.Quantity || r.QuantitySold || r.quantity || r.qty || 0) || 0;
        return { ItemName: name, QtySold: qty };
      })
      .filter((r) => r.ItemName);

    if (!sales.length) return `Error: Could not find ItemName and Quantity columns in ${fileName}`;

    // Clone inventory and subtract sales
    const newInv = invData.map((row) => ({ ...row }));

    // Map by ItemName for quick updates
    const invIndex = {};
    newInv.forEach((r, i) => {
      invIndex[String(r.ItemName).toLowerCase().trim()] = i;
    });

    sales.forEach((s) => {
      const key = String(s.ItemName).toLowerCase().trim();
      if (invIndex.hasOwnProperty(key)) {
        const i = invIndex[key];
        newInv[i].Quantity = Math.max(0, (Number(newInv[i].Quantity) || 0) - Number(s.QtySold || 0));
      } else {
        // If item not present, you might choose to add or ignore. We'll ignore, but could append.
      }
    });

    setInvData(newInv);

    const now = new Date().toLocaleString();
    setLatestUploadInfo({ name: fileName, type: "local", data: salesRows, processedAt: now });
    setDashboardUpdateRequired(true);
    return `Successfully processed ${fileName} — inventory updated.`;
  }

  // ---- Derived values for rendering ----
  const countries = Array.from(new Set(invData.map((r) => (r.Country || "Unknown").toString())));

  const topInventory = (() => {
    const grouped = {};
    invData.forEach((r) => {
      const name = r.ItemName || "Unknown";
      grouped[name] = (grouped[name] || 0) + (Number(r.Quantity) || 0);
    });
    const arr = Object.keys(grouped).map((k) => ({ ItemName: k, Quantity: grouped[k] }));
    return arr.sort((a, b) => b.Quantity - a.Quantity).slice(0, 10);
  })();

  const topItemsPerCategory = (() => {
    const byCat = {};
    invData.forEach((r) => {
      const cat = r.Category || "Uncategorized";
      if (!byCat[cat]) byCat[cat] = [];
      byCat[cat].push(r);
    });
    const result = [];
    Object.keys(byCat).forEach((cat) => {
      const rows = byCat[cat].filter((x) => (Number(x.Quantity) || 0) > 0);
      if (rows.length) {
        rows.sort((a, b) => (Number(b.Quantity) || 0) - (Number(a.Quantity) || 0));
        result.push({ Category: cat, Top: rows[0] });
      }
    });
    return result;
  })();

  const availableProducts = invData.filter((r) => Number(r.Quantity) > 10);
  const lowStock = invData.filter((r) => Number(r.Quantity) > 0 && Number(r.Quantity) <= 10);
  const outOfStock = invData.filter((r) => Number(r.Quantity) === 0);

  // ---- UI ----
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="text-sm text-gray-500">As of: {lastUpdated}</div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow p-4 mb-4">
        <h3 className="font-semibold mb-2">Upload your sales file here</h3>
        <div className="flex gap-3 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls, .pdf, .docx"
            onChange={handleFileChange}
            className=""
          />

          <div className="flex-1">
            {uploadStatus && (
              <div>
                {uploadStatus.type === "loading" && <div className="text-sm text-gray-600">{uploadStatus.message}</div>}
                {uploadStatus.type === "success" && <div className="text-sm text-green-600">{uploadStatus.message}</div>}
                {uploadStatus.type === "warning" && <div className="text-sm text-yellow-600">{uploadStatus.message}</div>}
                {uploadStatus.type === "error" && <div className="text-sm text-red-600">{uploadStatus.message}</div>}
              </div>
            )}
          </div>

          {latestUploadInfo && (
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-indigo-600 text-white rounded-md"
                onClick={() => alert(`Record for ${latestUploadInfo.name} marked for saving (backend required).`)}
              >
                💾 Save File Record
              </button>
              <button
                className="px-3 py-1 bg-gray-100 rounded-md"
                onClick={() => bytesToDownload(JSON.stringify(latestUploadInfo.data, null, 2), latestUploadInfo.name + ".json", "application/json")}
              >
                ⬇️ Download File
              </button>
            </div>
          )}
        </div>

        <hr className="my-4" />

        {/* Top row country cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {countries.length ? (
            countries.slice(0, 3).map((country, idx) => {
              const totalQty = invData
                .filter((r) => (r.Country || "Unknown") === country)
                .reduce((s, r) => s + (Number(r.Quantity) || 0), 0);
              return (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="text-sm text-gray-500">{country}</div>
                  <div className="text-2xl font-semibold">{totalQty.toLocaleString()}</div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-gray-500">No inventory data available.</div>
          )}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Bar Chart */}
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-semibold mb-2">📊 Inventory Product Quantity Chart (Top 10)</h4>
            {topInventory.length ? (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={topInventory} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <XAxis dataKey="ItemName" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Quantity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Inventory data not available to generate chart.</div>
            )}
          </div>

          {/* Right: Top Items per Category */}
          <div className="p-4 border rounded-lg bg-white">
            <h4 className="font-semibold mb-2">🏷️ Top Items per Category (Highest Quantity)</h4>
            {topItemsPerCategory.length ? (
              <div className="overflow-auto max-h-72">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">ItemName</th>
                      <th className="p-2 text-left">Warehouse</th>
                      <th className="p-2 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topItemsPerCategory.map((t, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{t.Category}</td>
                        <td className="p-2">{t.Top?.ItemName}</td>
                        <td className="p-2">{t.Top?.Warehouse}</td>
                        <td className="p-2">{t.Top?.Location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Inventory data not available.</div>
            )}
          </div>
        </div>

        {/* Product Availability */}
        <div className="mt-6 p-4 border rounded-lg bg-white">
          <h4 className="font-semibold mb-3">📦 Product Availability Status</h4>

          <div>
            <h5 className="font-medium mb-1">
              ✅ Available Products (Quantity &gt; 10)
            </h5>

            {availableProducts.length ? (
              <div className="overflow-auto max-h-44 mb-3">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">ItemID</th>
                      <th className="p-2 text-left">ItemName</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Quantity</th>
                      <th className="p-2 text-left">Warehouse</th>
                    </tr>
                  </thead>

                  <tbody>
                    {availableProducts.map((p, idx) => (
                      <tr key={p.ItemID ?? idx}>
                        <td className="p-2">{p.ItemID}</td>
                        <td className="p-2">{p.ItemName}</td>
                        <td className="p-2">{p.Category}</td>
                        <td className="p-2">{p.Quantity}</td>
                        <td className="p-2">{p.Warehouse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No products available.</div>
            )}

            <hr className="my-3" />

            <h5 className="font-medium mb-1">⚠️ Stock Running Out Soon (1 to 10 units)</h5>
            {lowStock.length ? (
              <div className="overflow-auto max-h-36 mb-3">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">ItemName</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((r, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{r.ItemName}</td>
                        <td className="p-2">{r.Category}</td>
                        <td className="p-2">{r.Quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No items in the low stock warning range (1-10 units).</div>
            )}

            <hr className="my-3" />

            <h5 className="font-medium mb-1">❌ Out of Stock Products (0 units)</h5>
            {outOfStock.length ? (
              <div className="overflow-auto max-h-36">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">ItemName</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Warehouse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outOfStock.map((r, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{r.ItemName}</td>
                        <td className="p-2">{r.Category}</td>
                        <td className="p-2">{r.Warehouse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-green-600">No items are currently out of stock!</div>
            )}
          </div>
        </div>

        {/* Warehouse Details Table */}
        <div className="mt-6 p-4 border rounded-lg bg-white">
          <h4 className="font-semibold mb-3">🏢 Warehouse Details (Current Stock)</h4>
          {invData.length ? (
            <div className="overflow-auto max-h-64">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Warehouse</th>
                    <th className="p-2 text-left">ItemName</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {invData
                    .filter((r) => Number(r.Quantity) > 0)
                    .map((r, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{r.Warehouse}</td>
                        <td className="p-2">{r.ItemName}</td>
                        <td className="p-2">{r.Category}</td>
                        <td className="p-2">{r.Quantity}</td>
                        <td className="p-2">{r.Location}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No inventory data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}