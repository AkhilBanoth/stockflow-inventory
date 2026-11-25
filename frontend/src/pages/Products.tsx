import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Package,
} from "lucide-react";

import Navbar from "../components/Navbar";
import {
  getProducts,
  deleteProduct,
  updateStock,
  type Product,
} from "../api/products";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async (term = search) => {
    try {
      setLoading(true);
      setError("");
      const result = await getProducts(term);
      setProducts(result);
    } catch {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts("");
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch {
      setError("Unable to delete product.");
    }
  };

  const handleStockUpdate = async (product: Product) => {
    const value = window.prompt(
      `Enter new stock quantity for ${product.name}:`,
      String(product.quantity_on_hand)
    );

    if (value === null) return;

    const quantity = Number(value);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Please enter a valid non-negative whole number.");
      return;
    }

    try {
      await updateStock(product.id, quantity);
      await loadProducts();
    } catch {
      setError("Unable to update stock quantity.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        <div className="page-heading">
          <div>
            <h1>Products</h1>
            <p>Manage and track all your inventory products.</p>
          </div>

          <Link to="/products/new" className="primary-link">
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        <div className="search-bar">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              loadProducts(value);
            }}
          />

          <button
            className="refresh-button"
            onClick={() => loadProducts()}
            title="Refresh products"
          >
            <RefreshCw size={17} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading-text">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <Package size={36} />
            <h3>No products found</h3>
            <p>Add a product or try another search.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Selling Price</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const threshold = product.low_stock_threshold ?? 5;
                  const isLowStock =
                    product.quantity_on_hand <= threshold;

                  return (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                        <small className="table-description">
                          {product.description || "No description"}
                        </small>
                      </td>

                      <td>{product.sku}</td>

                      <td>
                        <button
                          className="quantity-button"
                          onClick={() => handleStockUpdate(product)}
                          title="Update stock quantity"
                        >
                          {product.quantity_on_hand}
                        </button>
                      </td>

                      <td>
                        {product.selling_price !== null
                          ? `₹${Number(product.selling_price).toLocaleString("en-IN")}`
                          : "—"}
                      </td>

                      <td>
                        <span
                          className={
                            isLowStock
                              ? "status-badge"
                              : "status-badge healthy"
                          }
                        >
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/products/edit/${product.id}`}
                            className="icon-button"
                            title="Edit product"
                          >
                            <Pencil size={17} />
                          </Link>

                          <button
                            className="icon-button delete-button"
                            onClick={() => handleDelete(product.id)}
                            title="Delete product"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default Products;