import React, { useState, useEffect } from "react";
import Select from "react-select";
import ProductList from "./ProductList";
import { fetchClients } from "../api/ClientService";
import { fetchProducts } from "../api/ProductService";
import { getAllProducts, getAllClients } from "../services/database";

const EditOrderModal = ({ isOpen, onClose, onUpdateOrder, order, onDeleteOrder }) => {
  const [orderData, setOrderData] = useState({
    title: "",
    client: "",
    products: [],
    time: "",
    address: "",
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      if (isOnline) {
        const clients = await fetchClients(token);
        let products = await fetchProducts(token);
        setClients(clients);
        setProducts(products);
      } else {
        const localProducts = await getAllProducts();
        const localClients = await getAllClients();
        setClients(localClients);
        setProducts(localProducts);
      }
    };

    fetchData();
  }, [token, isOnline]);

  useEffect(() => {
    const loadProductImages = async () => {
      if (order && order.products.length > 0) {
        const localProducts = await getAllProducts();

        const updatedProducts = await Promise.all(
            order.products.map(async (p) => {
              const foundProduct = localProducts.find(prod => prod.id === p.id);
              return {
                ...p,
                image: foundProduct?.image || "",
              };
            })
        );

        setOrderData(prevData => ({
          ...prevData,
          products: updatedProducts,
        }));
      }
    };

    if (isOpen) {
      loadProductImages();
    }
  }, [order, isOpen]);

  useEffect(() => {
    if (order && products.length > 0) {
      const updatedProducts = order.products.map(p => {
        const foundProduct = products.find(prod => prod.id === p.id);
        return {
          ...p,
          title: foundProduct?.title || "Unknown product",
        };
      });

      setOrderData({
        title: order.title,
        client: clients.find(client => client.id === order.client_id) ? { value: order.client_id, label: `${order.client_name}` } : "",
        products: updatedProducts,
        time: order.date ? new Date(order.date).toISOString().slice(0, 16) : "",
        address: order.address || "",
      });
    }
  }, [order, clients, products]);

  const handleDelete = async () => {
    if (!order || !token) return;
    onDeleteOrder(order.id);
  };

  const handleProductSelect = async (e) => {
    const productId = parseInt(e.target.value);
    if (!orderData.products.some((p) => p.id === productId)) {
      const product = products.find((p) => p.id === productId);
      const localProducts = await getAllProducts();
      const foundProduct = localProducts.find(prod => prod.id === productId);

      const newProduct = {
        ...product,
        quantity: 1,
        image: foundProduct?.image || "",
      };

      setOrderData({
        ...orderData,
        products: [...orderData.products, newProduct],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderData.title || !orderData.time || !orderData.address) {
      alert("Please fill in all required fields!");
      return;
    }

    const formattedDate = new Date(orderData.time).toISOString();

    const updatedOrder = {
      id: order.id,
      title: orderData.title,
      start: formattedDate,
      client_id: orderData.client?.value || null,
      products: orderData.products,
      address: orderData.address,
    };

    onUpdateOrder(updatedOrder);
    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Order</h2>
          <form onSubmit={handleSubmit}>
            <label>Order Title:</label>
            <input
                type="text"
                name="title"
                value={orderData.title}
                onChange={(e) => setOrderData({ ...orderData, title: e.target.value })}
                required
            />

            <label>Client:</label>
            <Select
                options={clients.map(client => ({
                  value: client.id,
                  label: `${client.first_name} ${client.last_name}`,
                }))}
                value={orderData.client}
                onChange={(selectedClient) => setOrderData({ ...orderData, client: selectedClient })}
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
                onUpdateQuantity={(id, quantity) => setOrderData({
                  ...orderData,
                  products: orderData.products.map(p => (p.id === id ? { ...p, quantity } : p)),
                })}
                onRemoveProduct={(id) => setOrderData({
                  ...orderData,
                  products: orderData.products.filter(p => p.id !== id),
                })}
            />

            <label>Date and Time:</label>
            <input
                type="datetime-local"
                name="time"
                value={orderData.time}
                onChange={(e) => setOrderData({ ...orderData, time: e.target.value })}
                required
            />

            <label>Address:</label>
            <input
                type="text"
                name="address"
                value={orderData.address}
                onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                required
            />

            <div className="modal-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="button" className="delete-button" onClick={handleDelete}>Delete Order</button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EditOrderModal;