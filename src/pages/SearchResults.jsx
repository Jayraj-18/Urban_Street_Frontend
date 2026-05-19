import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function SearchResults({ darkMode, setDarkMode }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const results = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <section className="px-6 md:px-20 py-14">
        <h2 className="text-xl font-semibold mb-2 dark:text-white">
          Search results for: <span className="text-green-500">"{query}"</span>
        </h2>
        <p className="text-sm text-gray-500 mb-8">{results.length} product(s) found</p>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No products matched your search.
          </p>
        )}
      </section>

      <Footer />
    </>
  );
}

export default SearchResults;