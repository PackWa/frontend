import React, { useState, useEffect } from "react";
import Select from "react-select";
import ProductList from "./ProductList";
import { getAllClients, getAllProducts } from "../services/database";

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

  useEffect(() => {
    const fetchData = async () => {
      const clients = await getAllClients();
      const products = await getAllProducts();
      setClients(clients);
      setProducts(products);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleClientChange = (selectedClient) => {
    setOrderData({ ...orderData, client: selectedClient });
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

  const updateQuantity = (id, quantity) => {
    setOrderData({
      ...orderData,
      products: orderData.products.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p
      ),
    });
  };

  const removeProduct = (id) => {
    setOrderData({
      ...orderData,
      products: orderData.products.filter((p) => p.id !== id),
    });
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
      alert("Заполните все обязательные поля!");
      return;
    }

    const newOrder = {
      title: orderData.title,
      start: new Date(orderData.time),
      end: new Date(orderData.time),
      client: orderData.client?.label || "Не указан",
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
        <h2>Создать заказ</h2>
        <form onSubmit={handleSubmit}>
          <label>Название заказа:</label>
          <input
            type="text"
            name="title"
            value={orderData.title}
            onChange={handleChange}
            required
          />

          <label>Клиент:</label>
          <Select
            options={clients.map((client) => ({
              value: client.id,
              label: `${client.name} ${client.surname}`,
            }))}
            value={orderData.client}
            onChange={handleClientChange}
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
            onUpdateQuantity={updateQuantity}
            onRemoveProduct={removeProduct}
          />

          <label>Время заказа:</label>
          <input
            type="datetime-local"
            name="time"
            value={orderData.time}
            onChange={handleChange}
            required
          />

          <label>Адрес:</label>
          <input
            type="text"
            name="address"
            value={orderData.address}
            onChange={handleChange}
            required
          />

          <div className="total-price">Итоговая сумма: {calculateTotal()} ₽</div>

          <button type="submit">Добавить заказ</button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;