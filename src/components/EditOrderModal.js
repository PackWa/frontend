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

  // Загрузка клиентов и продуктов
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      if (isOnline) {
        // Если интернет есть, загружаем данные с сервера
        const clients = await fetchClients(token);
        let products = await fetchProducts(token);
        setClients(clients);
        setProducts(products);
      } else {
        // Если интернета нет, загружаем данные из IndexedDB
        const localProducts = await getAllProducts();
        const localClients = await getAllClients();
        setClients(localClients);
        setProducts(localProducts);
      }
    };

    fetchData();
  }, [token, isOnline]);

  // Загрузка фотографий продуктов из IndexedDB при открытии модального окна
  useEffect(() => {
    const loadProductImages = async () => {
      if (order && order.products.length > 0) {
        const localProducts = await getAllProducts();

        const updatedProducts = await Promise.all(
          order.products.map(async (p) => {
            const foundProduct = localProducts.find(prod => prod.id === p.id);
            return {
              ...p,
              image: foundProduct?.image || "", // Используем плейсхолдер, если фото нет
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

  // Обновление данных заказа при изменении order, clients или products
  useEffect(() => {
    if (order && products.length > 0) {
      const updatedProducts = order.products.map(p => {
        const foundProduct = products.find(prod => prod.id === p.id);
        return {
          ...p,
          title: foundProduct?.title || "Неизвестный продукт",
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
        image: foundProduct?.image || "", // Используем плейсхолдер, если фото нет
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