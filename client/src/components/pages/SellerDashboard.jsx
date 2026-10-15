import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");

const SellerDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState("inventory"); // 'inventory', 'finances', 'equipment'

  const [products, setProducts] = useState([]);
  const [finances, setFinances] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);
  const [equipmentEditForm, setEquipmentEditForm] = useState({ pricePerHour: "", pricePerDay: "", image: "" });

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", image: "", category: "",
  });

  const [financeForm, setFinanceForm] = useState({
    type: "expense", amount: "", description: ""
  });

  const [equipmentForm, setEquipmentForm] = useState({
    name: "", description: "", pricePerHour: "", pricePerDay: "", image: "", location: ""
  });

  const fetchMyProducts = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/my-products/${user.id}?t=${Date.now()}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  }, [user]);

  const fetchFinances = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/finance/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch finances");
      const data = await response.json();
      setFinances(data);
    } catch (err) { console.error(err); }
  }, [user]);

  const fetchMyEquipment = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`${API_URL}/api/equipment/my-equipment/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch equipment");
      const data = await response.json();
      setEquipment(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  }, [user]);

  useEffect(() => {
    fetchMyProducts();
    fetchFinances();
    fetchMyEquipment();
  }, [fetchMyProducts, fetchFinances, fetchMyEquipment]);

  const handleProductChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFinanceChange = (e) => setFinanceForm({ ...financeForm, [e.target.name]: e.target.value });
  const handleEquipmentChange = (e) => setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value });

  const handleEquipmentEdit = (item) => {
    setEditingEquipmentId(item._id);
    setEquipmentEditForm({ pricePerHour: String(item.pricePerHour), pricePerDay: String(item.pricePerDay || ""), image: "" });
  };

  const handleEquipmentImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        alert("Could not read the selected image. Please try another file.");
        return;
      }
      setEquipmentEditForm((current) => ({ ...current, image: reader.result }));
    };
    reader.onerror = () => alert("Could not read the selected image. Please try another file.");
    reader.readAsDataURL(file);
  };

  const handleUpdateEquipment = async (e, item) => {
    e.preventDefault();
    if (!user?.id) {
      alert("Please log in again before updating equipment.");
      return;
    }

    const pricePerHour = Number(equipmentEditForm.pricePerHour);
    if (!Number.isFinite(pricePerHour) || pricePerHour < 0) {
      alert("Enter a valid non-negative hourly price.");
      return;
    }

    const pricePerDay = Number(equipmentEditForm.pricePerDay) || 0;
    const updates = { pricePerHour, pricePerDay, ownerId: user.id };
    if (equipmentEditForm.image) updates.image = equipmentEditForm.image;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/equipment/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.status === 404 && data.error === "Route not found") {
        throw new Error(`The configured API server does not have the equipment update route (${API_URL || window.location.origin}/api/equipment/${item._id}). Restart or redeploy the backend from the current server source.`);
      }
      if (!res.ok) throw new Error(data.error || "Could not update equipment.");

      setEquipment((current) => current.map((listedItem) =>
        listedItem._id === item._id ? data : listedItem
      ));
      setEditingEquipmentId(null);
      setEquipmentEditForm({ pricePerHour: "", pricePerDay: "", image: "" });
    } catch (err) {
      console.error("Error updating equipment:", err);
      alert(err.message || "Error updating equipment.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, price: Number(formData.price), sellerId: user.id }),
      });
      if (!res.ok) throw new Error();
      setFormData({ name: "", description: "", price: "", image: "", category: "" });
      fetchMyProducts();
    } catch { alert("Error adding product"); } finally { setLoading(false); }
  };

  const handleFinanceSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/finance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...financeForm, amount: Number(financeForm.amount), sellerId: user.id }),
      });
      if (!res.ok) throw new Error();
      setFinanceForm({ type: "expense", amount: "", description: "" });
      fetchFinances();
    } catch { alert("Error adding finance record"); } finally { setLoading(false); }
  };

  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/equipment`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...equipmentForm, pricePerHour: Number(equipmentForm.pricePerHour), pricePerDay: Number(equipmentForm.pricePerDay) || 0, ownerId: user.id }),
      });
      if (!res.ok) throw new Error();
      setEquipmentForm({ name: "", description: "", pricePerHour: "", pricePerDay: "", image: "", location: "" });
      fetchMyEquipment();
    } catch { alert("Error adding equipment"); } finally { setLoading(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchMyProducts();
    } catch (err) { console.error(err); }
  };

  const handleDeleteFinance = async (id) => {
    if (!window.confirm("Delete record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/finance/${id}`, { method: "DELETE" });
      if (res.ok) fetchFinances();
    } catch (err) { console.error(err); }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm("Delete equipment?")) return;
    try {
      const res = await fetch(`${API_URL}/api/equipment/${id}`, { method: "DELETE" });
      if (res.ok) fetchMyEquipment();
    } catch (err) { console.error(err); }
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
        <div className="text-xl">Please login to access the Seller Dashboard.</div>
      </div>
    );
  }

  const isDark = theme === "dark";
  const containerBg = isDark ? "#000" : "#f8f9fa";
  const textColor = isDark ? "#fff" : "#212529";
  const cardBg = isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff";
  const borderColor = isDark ? "rgba(255, 193, 7, 0.25)" : "#dee2e6";
  const shadowClass = isDark ? "shadow-lg" : "shadow-sm";

  const totalRevenue = finances.filter(f => f.type === 'revenue').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const profit = totalRevenue - totalExpense;

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: containerBg, color: textColor, paddingTop: "80px", transition: "0.3s" }}>
      <div className="container mx-auto px-4 mt-4">

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-warning mb-3">Seller Dashboard</h1>
          <p className="lead text-secondary">Manage your inventory, offer affordable equipment rentals to nearby farmers, and track your farm's finances.</p>
        </div>

        {/* Tabs */}
        <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
          <button 
            className={`btn px-4 py-2 fw-bold rounded-pill shadow-sm ${activeTab === 'inventory' ? 'btn-warning' : (isDark ? 'btn-outline-warning' : 'btn-outline-secondary')}`}
            onClick={() => setActiveTab('inventory')}
          >
            <i className="bi bi-box-seam me-2"></i> Inventory
          </button>
          <button 
            className={`btn px-4 py-2 fw-bold rounded-pill shadow-sm ${activeTab === 'finances' ? 'btn-warning' : (isDark ? 'btn-outline-warning' : 'btn-outline-secondary')}`}
            onClick={() => setActiveTab('finances')}
          >
            <i className="bi bi-graph-up-arrow me-2"></i> Finances
          </button>
          <button 
            className={`btn px-4 py-2 fw-bold rounded-pill shadow-sm ${activeTab === 'equipment' ? 'btn-warning' : (isDark ? 'btn-outline-warning' : 'btn-outline-secondary')}`}
            onClick={() => setActiveTab('equipment')}
          >
            <i className="bi bi-tractor me-2"></i> Equipment Rentals
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="row g-5">
            {/* Add Product Form */}
            <div className="col-lg-5">
              <div className={`p-4 rounded-4 ${shadowClass} border border-warning border-opacity-25`} style={{ background: cardBg, backdropFilter: "blur(10px)", borderColor: borderColor }}>
                <h3 className="mb-4 text-warning fw-bold border-bottom border-warning border-opacity-25 pb-2">
                  <i className="bi bi-plus-circle me-2"></i>Add New Product
                </h3>
                <form onSubmit={handleProductSubmit} className="d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="form-label text-secondary small text-uppercase fw-bold">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleProductChange} className="form-control bg-dark text-white border-secondary" required />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-secondary small text-uppercase fw-bold">Category</label>
                      <select name="category" value={formData.category} onChange={handleProductChange} className="form-select bg-dark text-white border-secondary" required>
                        <option value="" disabled>Select Category</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Grains">Grains</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small text-uppercase fw-bold">Price (₹)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleProductChange} className="form-control bg-dark text-white border-secondary" min="0" step="0.01" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label small text-uppercase fw-bold text-secondary">Product Image</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({ ...formData, image: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }} className="form-control bg-dark text-white border-secondary" required={!formData.image} />
                  </div>
                  <div className="form-group">
                    <label className="form-label small text-uppercase fw-bold text-secondary">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleProductChange} className="form-control bg-dark text-white border-secondary" rows="3" required></textarea>
                  </div>
                  <button type="submit" disabled={loading} className={`btn w-100 fw-bold py-2 mt-2 shadow-sm btn-warning`}>
                    {loading ? "Adding..." : "Publish Product"}
                  </button>
                </form>
              </div>
            </div>

            {/* Product List */}
            <div className="col-lg-7">
              <div className={`p-4 rounded-4 ${shadowClass} border h-100`} style={{ background: isDark ? '#212529' : '#fff', borderColor: borderColor }}>
                <h3 className={`mb-4 fw-bold border-bottom pb-2 ${isDark ? 'text-white border-secondary' : 'text-dark border-light'}`}>
                  <i className="bi bi-box-seam me-2"></i>My Inventory ({products.length})
                </h3>
                {products.length === 0 ? (
                  <div className={`text-center py-5 ${isDark ? 'text-muted' : 'text-secondary'}`}><div className="fs-1 mb-3">📦</div><p>No products listed yet.</p></div>
                ) : (
                  <div className="overflow-auto pe-2" style={{ maxHeight: "800px" }}>
                    <div className="row g-3">
                      {products.map((p) => (
                        <div key={p._id} className="col-md-6">
                          <div className={`card h-100 shadow-sm border ${isDark ? 'bg-black text-white border-secondary' : 'bg-light text-dark border-light'}`}>
                            <div className="position-relative">
                              <img src={p.image} alt={p.name} className="card-img-top" style={{ height: "150px", objectFit: "cover" }} />
                              <span className="position-absolute top-0 end-0 badge m-2 bg-warning text-dark">₹{p.price}</span>
                            </div>
                            <div className="card-body p-3 d-flex flex-column">
                              <h6 className="card-title fw-bold text-truncate mb-1">{p.name}</h6>
                              <div className="small mb-2 text-secondary">{p.category}</div>
                              <button onClick={() => handleDeleteProduct(p._id)} className="btn btn-outline-danger btn-sm w-100 mt-auto"><i className="bi bi-trash me-1"></i> Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="row g-5">
            {/* Finance Summary */}
            <div className="col-12">
              <div className="row g-4 text-center">
                <div className="col-md-4"><div className={`p-4 rounded-4 shadow-sm border ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}><h5 className="text-muted">Total Revenue</h5><h2 className="text-success fw-bold">₹{totalRevenue.toFixed(2)}</h2></div></div>
                <div className="col-md-4"><div className={`p-4 rounded-4 shadow-sm border ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}><h5 className="text-muted">Total Expenses</h5><h2 className="text-danger fw-bold">₹{totalExpense.toFixed(2)}</h2></div></div>
                <div className="col-md-4"><div className={`p-4 rounded-4 shadow-sm border ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}><h5 className="text-muted">Net Profit</h5><h2 className={`fw-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`}>₹{profit.toFixed(2)}</h2></div></div>
              </div>
            </div>

            {/* Add Finance Form */}
            <div className="col-lg-5">
              <div className={`p-4 rounded-4 ${shadowClass} border border-warning border-opacity-25`} style={{ background: cardBg, backdropFilter: "blur(10px)", borderColor: borderColor }}>
                <h3 className="mb-4 text-warning fw-bold border-bottom border-warning border-opacity-25 pb-2">
                  <i className="bi bi-plus-circle me-2"></i>Add Record
                </h3>
                <form onSubmit={handleFinanceSubmit} className="d-flex flex-column gap-3">
                  <div className="form-group"><label className="form-label text-secondary small text-uppercase fw-bold">Type</label><select name="type" value={financeForm.type} onChange={handleFinanceChange} className="form-select bg-dark text-white border-secondary" required><option value="expense">Expense</option><option value="revenue">Revenue</option></select></div>
                  <div className="form-group"><label className="form-label text-secondary small text-uppercase fw-bold">Amount (₹)</label><input type="number" name="amount" value={financeForm.amount} onChange={handleFinanceChange} className="form-control bg-dark text-white border-secondary" min="0" step="0.01" required /></div>
                  <div className="form-group"><label className="form-label text-secondary small text-uppercase fw-bold">Description</label><input type="text" name="description" value={financeForm.description} onChange={handleFinanceChange} className="form-control bg-dark text-white border-secondary" required /></div>
                  <button type="submit" disabled={loading} className={`btn w-100 fw-bold py-2 mt-2 shadow-sm btn-warning`}>{loading ? "Adding..." : "Save Record"}</button>
                </form>
              </div>
            </div>

            {/* Finance List */}
            <div className="col-lg-7">
              <div className={`p-4 rounded-4 ${shadowClass} border h-100`} style={{ background: isDark ? '#212529' : '#fff', borderColor: borderColor }}>
                <h3 className={`mb-4 fw-bold border-bottom pb-2 ${isDark ? 'text-white border-secondary' : 'text-dark border-light'}`}><i className="bi bi-journal-text me-2"></i>Recent Transactions</h3>
                {finances.length === 0 ? (<div className="text-center py-5 text-muted"><p>No financial records found.</p></div>) : (
                  <div className="table-responsive">
                    <table className={`table table-hover ${isDark ? 'table-dark' : 'table-light'}`}>
                      <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Action</th></tr></thead>
                      <tbody>
                        {finances.map(f => (
                          <tr key={f._id}>
                            <td>{new Date(f.date).toLocaleDateString()}</td>
                            <td>{f.description}</td>
                            <td className={f.type === 'revenue' ? 'text-success fw-bold' : 'text-danger fw-bold'}>{f.type === 'revenue' ? '+' : '-'}₹{f.amount.toFixed(2)}</td>
                            <td><button className="btn btn-sm btn-outline-danger py-0" onClick={() => handleDeleteFinance(f._id)}><i className="bi bi-trash"></i></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="row g-5">
            {/* Add Equipment Form */}
            <div className="col-lg-5">
              <div className={`p-4 rounded-4 ${shadowClass} border border-warning border-opacity-25`} style={{ background: cardBg, backdropFilter: "blur(10px)", borderColor: borderColor }}>
                <h3 className="mb-4 text-warning fw-bold border-bottom border-warning border-opacity-25 pb-2">
                  <i className="bi bi-tools me-2"></i>Share Equipment at a Fair Rate
                </h3>
                <form onSubmit={handleEquipmentSubmit} className="d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="form-label text-secondary small text-uppercase fw-bold">Equipment Name</label>
                    <input type="text" name="name" value={equipmentForm.name} onChange={handleEquipmentChange} className="form-control bg-dark text-white border-secondary" placeholder="e.g. Mahindra Tractor" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-secondary small text-uppercase fw-bold">Affordable Price Per Hour (₹)</label>
                    <input type="number" name="pricePerHour" value={equipmentForm.pricePerHour} onChange={handleEquipmentChange} className="form-control bg-dark text-white border-secondary" placeholder="Set a fair local rate" min="0" step="1" required />
                    <div className="form-text text-secondary">Choose a fair rate that keeps equipment accessible to small and nearby farmers.</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label text-secondary small text-uppercase fw-bold">Affordable Price Per Day (₹)</label>
                    <input type="number" name="pricePerDay" value={equipmentForm.pricePerDay} onChange={handleEquipmentChange} className="form-control bg-dark text-white border-secondary" placeholder="Daily rental rate (optional)" min="0" step="1" />
                    <div className="form-text text-secondary">Offer a discounted daily rate for longer rentals — great for seasonal demand.</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label text-secondary small text-uppercase fw-bold">Location</label>
                    <input type="text" name="location" value={equipmentForm.location} onChange={handleEquipmentChange} className="form-control bg-dark text-white border-secondary" placeholder="e.g. Pune, Maharashtra" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label small text-uppercase fw-bold text-secondary">Image</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setEquipmentForm({ ...equipmentForm, image: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }} className="form-control bg-dark text-white border-secondary" required={!equipmentForm.image} />
                  </div>
                  <div className="form-group">
                    <label className="form-label small text-uppercase fw-bold text-secondary">Description</label>
                    <textarea name="description" value={equipmentForm.description} onChange={handleEquipmentChange} className="form-control bg-dark text-white border-secondary" rows="2" required></textarea>
                  </div>
                  <button type="submit" disabled={loading} className={`btn w-100 fw-bold py-2 mt-2 shadow-sm btn-warning`}>
                    {loading ? "Listing..." : "Offer Equipment for Rent"}
                  </button>
                </form>
              </div>
            </div>

            {/* Equipment List */}
            <div className="col-lg-7">
              <div className={`p-4 rounded-4 ${shadowClass} border h-100`} style={{ background: isDark ? '#212529' : '#fff', borderColor: borderColor }}>
                <h3 className={`mb-4 fw-bold border-bottom pb-2 ${isDark ? 'text-white border-secondary' : 'text-dark border-light'}`}>
                  <i className="bi bi-tractor me-2"></i>My Listed Equipment ({equipment.length})
                </h3>
                {equipment.length === 0 ? (
                  <div className={`text-center py-5 ${isDark ? 'text-muted' : 'text-secondary'}`}><div className="fs-1 mb-3">🚜</div><p>No equipment listed for rent yet.</p></div>
                ) : (
                  <div className="overflow-auto pe-2" style={{ maxHeight: "800px" }}>
                    <div className="row g-3">
                      {equipment.map((e) => (
                        <div key={e._id} className="col-md-6">
                          <div className={`card h-100 shadow-sm border ${isDark ? 'bg-black text-white border-secondary' : 'bg-light text-dark border-light'}`}>
                            <div className="position-relative">
                              <img src={e.image} alt={e.name} className="card-img-top" style={{ height: "150px", objectFit: "cover" }} />
                              <span className="position-absolute top-0 end-0 d-flex flex-column gap-1 m-2">
                                <span className="badge bg-success text-white">₹{e.pricePerHour}/hr</span>
                                {e.pricePerDay > 0 && <span className="badge bg-info text-dark">₹{e.pricePerDay}/day</span>}
                              </span>
                            </div>
                            <div className="card-body p-3 d-flex flex-column">
                              <h6 className="card-title fw-bold text-truncate mb-1">{e.name}</h6>
                              <div className="small mb-2 text-secondary">{e.location}</div>
                              {editingEquipmentId === e._id ? (
                                <form onSubmit={(event) => handleUpdateEquipment(event, e)} className="d-flex flex-column gap-2 mt-auto">
                                  <label className="form-label small mb-0" htmlFor={`equipment-price-${e._id}`}>Price per hour (₹)</label>
                                  <input
                                    id={`equipment-price-${e._id}`}
                                    type="number"
                                    min="0"
                                    step="1"
                                    required
                                    value={equipmentEditForm.pricePerHour}
                                    onChange={(event) => setEquipmentEditForm((current) => ({ ...current, pricePerHour: event.target.value }))}
                                    className="form-control form-control-sm"
                                  />
                                  <label className="form-label small mb-0 mt-1" htmlFor={`equipment-price-day-${e._id}`}>Price per day (₹)</label>
                                  <input
                                    id={`equipment-price-day-${e._id}`}
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={equipmentEditForm.pricePerDay}
                                    onChange={(event) => setEquipmentEditForm((current) => ({ ...current, pricePerDay: event.target.value }))}
                                    className="form-control form-control-sm"
                                  />
                                  <label className="form-label small mb-0" htmlFor={`equipment-image-${e._id}`}>Replace image (optional)</label>
                                  <input
                                    id={`equipment-image-${e._id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEquipmentImageChange}
                                    className="form-control form-control-sm"
                                  />
                                  {equipmentEditForm.image && (
                                    <img src={equipmentEditForm.image} alt="New equipment preview" className="img-fluid rounded" style={{ maxHeight: "100px", objectFit: "cover" }} />
                                  )}
                                  <button type="submit" disabled={loading} className="btn btn-success btn-sm w-100">
                                    {loading ? "Saving..." : "Save Changes"}
                                  </button>
                                  <button type="button" onClick={() => setEditingEquipmentId(null)} className="btn btn-outline-secondary btn-sm w-100">
                                    Cancel
                                  </button>
                                </form>
                              ) : (
                                <div className="d-flex gap-2 mt-auto">
                                  <button onClick={() => handleEquipmentEdit(e)} className="btn btn-outline-success btn-sm w-100">
                                    <i className="bi bi-pencil-square me-1"></i> Update
                                  </button>
                                  <button onClick={() => handleDeleteEquipment(e._id)} className="btn btn-outline-danger btn-sm w-100">
                                    <i className="bi bi-trash me-1"></i> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SellerDashboard;
