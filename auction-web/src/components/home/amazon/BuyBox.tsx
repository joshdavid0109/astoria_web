interface Props {
  price?: number;
  stock?: number;
}

const BuyBox: React.FC<Props> = ({ price, stock = 10 }) => {
  return (
    <div className="border border-gray-300 bg-white p-4 rounded text-sm">
      <div className="text-2xl font-semibold mb-2">
        {price ? `CAD $${price}` : "See price"}
      </div>

      <div className="text-green-700 mb-2">
        {stock > 0 ? "In Stock" : "Out of Stock"}
      </div>

      <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full mb-2">
        Add to Cart
      </button>

      <button className="w-full bg-[#FFA41C] hover:bg-[#FA8900] py-2 rounded-full">
        Buy Now
      </button>

      <div className="mt-3 text-xs text-gray-600">
        FREE delivery by Astoria
      </div>
    </div>
  );
};

export default BuyBox;
