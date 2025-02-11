import React, { useState, useEffect } from "react";
import Select from "react-select";
import ProductList from "./ProductList";
import { fetchClients } from "../api/ClientService";
import { fetchProducts } from "../api/ProductService";

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
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const clients = await fetchClients(token);
      const products = await fetchProducts(token);
      setClients(clients);
      setProducts(products);
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (order) {
      const updatedProducts = order.products.map(p => ({
        ...p,
        title: products.find(prod => prod.id === p.id)?.title || "Неизвестный продукт",
      }));
  
      setOrderData({
        title: order.title,
        client: clients.find(client => client.id === order.client_id)
          ? { value: order.client_id, label: `${order.client_name}` }
          : "",
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

  const handleProductSelect = (e) => {
    const productId = parseInt(e.target.value);
    if (!orderData.products.some((p) => p.id === productId)) {
      const product = products.find((p) => p.id === productId);
      setOrderData({
        ...orderData,
        products: [...orderData.products, { ...product, quantity: 1 }],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderData.title || !orderData.time || !orderData.address) {
      alert("Заполните все обязательные поля!");
      return;
    }

    const updatedOrder = {
      id: order.id,
      title: orderData.title,
      date: new Date(orderData.time).toISOString(),
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
        <h2>Редактировать заказ</h2>
        <form onSubmit={handleSubmit}>
          <label>Название заказа:</label>
          <input
            type="text"
            name="title"
            value={orderData.title}
            onChange={(e) => setOrderData({ ...orderData, title: e.target.value })}
            required
          />

          <label>Клиент:</label>
          <Select
            options={clients.map(client => ({
              value: client.id,
              label: `${client.first_name} ${client.last_name}`,
            }))}
            value={orderData.client}
            onChange={(selectedClient) => setOrderData({ ...orderData, client: selectedClient })}
            placeholder="Выберите клиента..."
          />

          <label>Выбор продуктов:</label>
          <select onChange={handleProductSelect}>
            <option value="">Выберите продукт...</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — {product.price} ₽
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

          <label>Дата и время:</label>
          <input
            type="datetime-local"
            name="time"
            value={orderData.time}
            onChange={(e) => setOrderData({ ...orderData, time: e.target.value })}
            required
          />

          <label>Адрес:</label>
          <input
            type="text"
            name="address"
            value={orderData.address}
            onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
            required
          />

          <div className="modal-actions">
            <button type="submit">Сохранить изменения</button>
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="button" className="delete-button" onClick={handleDelete}>Удалить заказ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;