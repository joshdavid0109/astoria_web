// src/components/home/CategorySidebar.tsx
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Cat = { categories_id: number; name: string; icon?: string | null; parent_id?: number | null };

const CategorySidebar: React.FC<{
  categories: Cat[];
  selected?: string | null;
  onSelect: (name: string | null) => void;
}> = ({ categories = [], selected, onSelect }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <aside className="hidden lg:block w-64 sticky top-24">
      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-800">Categories</h3>
          <button onClick={() => setCollapsed((s) => !s)} className="text-gray-500 p-1 rounded">
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {!collapsed && (
          <ul className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
            {categories.map((c) => {
              const isActive = selected === c.name;
              return (
                <li key={c.categories_id}>
                  <button onClick={() => onSelect(isActive ? null : c.name)} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 ${isActive ? "bg-orange-50 border-l-4 border-orange-500" : ""}`}>
                    {c.icon ? <img src={c.icon} alt={c.name} className="w-6 h-6 rounded" /> : <span className="w-6 h-6 flex items-center justify-center">•</span>}
                    <span className="text-sm text-gray-700">{c.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default CategorySidebar;
