type ProductInfoProps = {
  product: any;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  if (!product) return null;

  return (
    <>
      <p className="text-sm text-blue-600 hover:underline cursor-pointer">
        Visit the {product.brand || "Seller"} Store
      </p>

      <h1 className="text-xl font-semibold mt-1">
        {product.title}
      </h1>

      {product.status && (
        <p className="text-sm text-gray-600 mt-1">
          Condition: <span className="font-medium">{product.status}</span>
        </p>
      )}

      <div className="mt-4 text-sm text-gray-700 leading-relaxed">
        {product.description}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Product details</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-gray-500">Category</div>
          <div>{product.category}</div>

          <div className="text-gray-500">Price</div>
          <div>CAD ${product.price}</div>

          <div className="text-gray-500">Shipping</div>
          <div>Ships from Canada</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">About this item</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Authentic item</li>
          <li>Trusted seller</li>
          <li>Secure payment</li>
        </ul>
      </div>
    </>
  );
};

export default ProductInfo;
