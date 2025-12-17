import { Link } from "react-router-dom";

const Breadcrumbs = ({ category }: { category?: string }) => {
  return (
    <nav className="text-sm text-gray-600 mb-3">
      <Link to="/" className="hover:underline">Home</Link>
      {category && (
        <>
          <span className="mx-1">›</span>
          <span className="font-semibold text-gray-800">{category}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;
