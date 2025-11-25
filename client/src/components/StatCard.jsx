export default function StatCard({ title = "Title", value = "0", color = "green" }) {
  const colors = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${colors[color]}`}
    >
      <p className="text-sm font-medium">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
