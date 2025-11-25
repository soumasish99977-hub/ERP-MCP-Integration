import React from "react";

const ChartCard = ({ title, children }) => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300">
      {/* Title */}
      {title && (
        <h2 className="text-lg font-semibold text-white mb-4 tracking-wide">
          {title}
        </h2>
      )}

      {/* Chart Slot */}
      <div className="w-full h-[260px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
