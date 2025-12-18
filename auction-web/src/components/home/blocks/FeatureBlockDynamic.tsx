import { useNavigate } from "react-router-dom";

interface DynamicBlock {
  title?: string;
  items: any[];
  description: string;
}

const FeatureBlockDynamic = ({ block } :{ block: DynamicBlock }) => {
  const navigate = useNavigate();

  return (
    <div className="col-span-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-400/20 group-hover:opacity-100 opacity-0 transition-opacity"></div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT TEXT */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-slate-900">{block.title}</h2>
          <div className="mt-3 h-1 w-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>

          <p className="mt-4 text-slate-600">{block.description}</p>

          <button
            onClick={() => navigate(`/category/${encodeURIComponent(block.items[0].name)}`)}
            className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold shadow-lg hover:shadow-xl"
          >
            Shop Now
          </button>
        </div>

        {/* RIGHT IMAGE GRID */}
        <div className="grid grid-cols-2 gap-4 p-8">
          {block.items.map((item: any) => (
            <button
              key={item.name}
              onClick={() => navigate(`/category/${encodeURIComponent(item.name)}`)}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="h-32 bg-gray-50 overflow-hidden">
                <img
                  src={item.image || "/placeholder.png"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 text-sm font-semibold text-slate-700">
                {item.name}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeatureBlockDynamic;
