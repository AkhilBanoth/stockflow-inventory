
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  createProduct,
  getProduct,
  updateProduct,
  type ProductCreate,
} from "../api/products";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<ProductCreate>({
    name: "",
    sku: "",
    description: "",
    quantity_on_hand: 0,
    cost_price: null,
    selling_price: null,
    low_stock_threshold: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const product = await getProduct(Number(id));

        setForm({
          name: product.name,
          sku: product.sku,
          description: product.description ?? "",
          quantity_on_hand: product.quantity_on_hand,
          cost_price: product.cost_price,
          selling_price: product.selling_price,
          low_stock_threshold: product.low_stock_threshold,
        });
      } catch {
        setError("Unable to load product details.");
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "name" || name === "sku" || name === "description"
          ? value
          : value === ""
            ? null
            : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.sku.trim()) {
      setError("Product name and SKU are required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        sku: form.sku.trim(),
        description: form.description || null,
      };

      if (isEditing) {
        await updateProduct(Number(id), payload);
      } else {
        await createProduct(payload);
      }

      navigate("/products");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Unable to save product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        <div className="page-heading">
          <div>
            <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>
            <p>Enter your product and inventory details.</p>
          </div>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-grid">
            <div className="form-field">
              <label>Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                maxLength={255}
                required
              />
            </div>

            <div className="form-field">
              <label>SKU *</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Example: LAP-001"
                maxLength={100}
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description ?? ""}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="form-field">
              <label>Quantity on Hand *</label>
              <input
                type="number"
                name="quantity_on_hand"
                value={form.quantity_on_hand}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>

            <div className="form-field">
              <label>Low Stock Threshold</label>
              <input
                type="number"
                name="low_stock_threshold"
                value={form.low_stock_threshold ?? ""}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>

            <div className="form-field">
              <label>Cost Price (₹)</label>
              <input
                type="number"
                name="cost_price"
                value={form.cost_price ?? ""}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-field">
              <label>Selling Price (₹)</label>
              <input
                type="number"
                name="selling_price"
                value={form.selling_price ?? ""}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/products" className="secondary-button">
              Cancel
            </Link>

            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default ProductForm;
