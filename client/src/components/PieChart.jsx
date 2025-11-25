import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, labels, title }) => {
  const chartData = {
    labels: labels || ["Warehouse A", "Warehouse B", "Warehouse C"],
    datasets: [
      {
        label: title || "Warehouse Capacity",
        data: data || [30, 45, 25],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(234, 179, 8, 0.7)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(234, 179, 8, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { labels: { color: "white" } },
      title: { display: true, text: title || "", color: "white" },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;