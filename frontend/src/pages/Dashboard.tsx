import { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "../api/dashboard";

const Dashboard = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getDashboardSummary();
      setData(result);
    } catch {
      setError("Unable to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        <div className="page-heading">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of your inventory and stock levels.</p>
          </div>

          <button className="refresh-button" onClick={loadDashboard}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {loading && <p className="loading-text">Loading dashboard...</p>}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadDashboard}>Retry</button>
          </div>
        )}

        {data && !loading && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">
                  <Package size={24} />
                </div>
                <p>Total Products</p>
                <h2>{data.total_products}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">
                  <Boxes size={24} />
                </div>
                <p>Total Stock Quantity</p>
                <h2>{data.total_quantity}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">
                  <AlertTriangle size={24} />
                </div>
                <p>Low Stock Items</p>
                <h2>{data.low_stock_count}</h2>
              </div>
            </section>

            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <h2>Low Stock Products</h2>
                  <p>Products that need restocking.</p>
                </div>
              </div>

              {data.low_stock_products.length === 0 ? (
                <div className="empty-state">
                  <Package size={36} />
                  <h3>All stock levels are healthy!</h3>
                  <p>No low-stock products found.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>SKU</th>
                        <th>Available Quantity</th>
                        <th>Threshold</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.low_stock_products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.sku}</td>
                          <td>{product.quantity_on_hand}</td>
                          <td>{product.low_stock_threshold ?? 5}</td>
                          <td>
                            <span className="status-badge">
                              Low Stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default Dashboard;