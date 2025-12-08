import React from "react";
import { useNavigate } from "react-router-dom";

const HorizontalScrollBlockDynamic = ({ block }) => {
  const navigate = useNavigate();

  return (
    <div className="col-span-12 bg-white rounded-3xl shadow-lg border overflow-hidden p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-slate-900">{block.title}</h3>
        <button
          onClick={() => navigate(`/category/${encodeURIComponent(block.items[0].name)}`)}
          className="text-orange-600 hover:underline text-sm font-medium flex items-center"
        >
          See more →
        </button>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-3">
        {block.items.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(`/category/${encodeURIComponent(item.name)}`)}
            className="min-w-[180px] bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="h-36 bg-gray-50 overflow-hidden">
              <img
                src={item.image || "/placeholder.png"}
                className="h-full w-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4 text-sm font-medium text-slate-700">{item.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollBlockDynamic;
