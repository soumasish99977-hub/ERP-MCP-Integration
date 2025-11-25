import React from "react";

const DataTable = ({ columns = [], data = [] }) => {
  return (
    <div className="w-full overflow-x-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-white/20 text-white">
            {columns.map((col) => (
              <th key={col} className="py-3 px-4 text-left font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-300"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                {columns.map((col) => (
                  <td key={col} className="py-3 px-4 text-gray-200">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
