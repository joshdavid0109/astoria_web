import React from "react";
import { useNavigate } from "react-router-dom";

interface Block {
  title: string;
  items: Array<{
    name: string;
    image?: string;
  }>;
}

const StandardBlockDynamic = ({ block }: { block: Block }) => {
  const navigate = useNavigate();
  return (
    <div className="col-span-12 md:col-span-4 xl:col-span-3 bg-white rounded-3xl shadow-lg border overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900">{block.title}</h3>
        <div className="mt-2 h-1 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 pb-6">
        {block.items.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(`/category/${encodeURIComponent(item.name)}`)}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="h-28 bg-gray-50 overflow-hidden">
              <img
                src={item.image || "/placeholder.png"}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3 text-sm font-medium text-slate-700">{item.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StandardBlockDynamic;
