import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, labels, title }) => {
  const chartData = {
    labels: labels || ["Item A", "Item B", "Item C", "Item D"],
    datasets: [
      {
        label: title || "Top Selling Items",
        data: data || [12, 19, 8, 15],
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Tailwind blue-500
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "white" } },
      title: { display: true, text: title || "", color: "white" },
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;