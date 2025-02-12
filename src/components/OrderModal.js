import React, { useState, useEffect } from "react";
import Select from "react-select";
import ProductList from "./ProductList";
import { fetchClients } from "../api/ClientService";
import { fetchProducts } from "../api/ProductService";
import { getAllProducts } from "../services/database";

const OrderModal = ({ isOpen, onClose, onAddOrder }) => {
  const [orderData, setOrderData] = useState({
    title: "",
    client: "",
    products: [],
    time: "",
    address: "",
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const clients = await fetchClients(token);
      let products = await fetchProducts(token);
      const localProducts = await getAllProducts();

      products = products.map(product => {
        const localProduct = localProducts.find(p => p.id === product.id);
        return localProduct ? { ...product, image: localProduct.image } : product;
      });

      setClients(clients);
      setProducts(products);
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleClientChange = (selectedClient) => {
    setOrderData({ ...orderData, client: selectedClient });
  };

  const handleProductSelect = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find((p) => p.id === productId);
    if (product && !orderData.products.some((p) => p.id === productId)) {
      setOrderData((prevData) => ({
        ...prevData,
        products: [...prevData.products, { ...product, quantity: 1 }],
      }));
    }
  };

  const updateQuantity = (id, quantity) => {
    setOrderData((prevData) => ({
      ...prevData,
      products: prevData.products.map((p) =>
          p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p
      ),
    }));
  };

  const removeProduct = (id) => {
    setOrderData((prevData) => ({
      ...prevData,
      products: prevData.products.filter((p) => p.id !== id),
    }));
  };

  const calculateTotal = () => {
    return orderData.products.reduce(
        (total, product) => total + (product.price * (product.quantity || 1)),
        0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderData.title || !orderData.time || !orderData.address) {
      alert("Please fill in all required fields!");
      return;
    }

    const newOrder = {
      title: orderData.title,
      start: new Date(orderData.time),
      end: new Date(orderData.time),
      client_id: orderData.client?.value || null,
      products: orderData.products,
      address: orderData.address,
      total: calculateTotal(),
    };
    onAddOrder(newOrder);
    setOrderData({ title: "", client: "", products: [], time: "", address: "" });
  };

  if (!isOpen) return null;

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Create Order</h2>
          <form onSubmit={handleSubmit}>
            <label>Order Title:</label>
            <input
                type="text"
                name="title"
                value={orderData.title}
                onChange={handleChange}
                required
            />

            <label>Client:</label>
            <Select
                options={clients.map((client) => ({
                  value: client.id,
                  label: `${client.first_name} ${client.last_name}`,
                }))}
                value={orderData.client}
                onChange={handleClientChange}
                placeholder="Select client..."
            />

            <label>Product Selection:</label>
            <select onChange={handleProductSelect}>
              <option value="">Select product...</option>
              {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title} — {product.price} ₽
                  </option>
              ))}
            </select>

            <ProductList
                products={orderData.products}
                onUpdateQuantity={updateQuantity}
                onRemoveProduct={removeProduct}
            />

            <label>Order Time:</label>
            <input
                type="datetime-local"
                name="time"
                value={orderData.time}
                onChange={handleChange}
                required
            />

            <label>Address:</label>
            <input
                type="text"
                name="address"
                value={orderData.address}
                onChange={handleChange}
                required
            />

            <div className="total-price">Total Amount: {calculateTotal()} ₽</div>

            <button type="submit">Add Order</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>
  );
};

export default OrderModal;
