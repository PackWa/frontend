/**
 * Agenda Component - Order Management Calendar
 *
 * This component provides a calendar view for managing orders. It allows users to:
 * - View orders in an agenda-style calendar.
 * - Create, edit, and delete orders.
 * - Sync orders from an API when online and store them in IndexedDB for offline access.
 * - Schedule and manage order notifications.
 *
 * Main Features:
 * - Uses react-big-calendar for event visualization.
 * - Handles offline and online order synchronization.
 * - Integrates with notification services.
 *
 * Dependencies:
 * - react-big-calendar, moment, IndexedDB services, notification services.
 */


import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import OrderModal from "../components/OrderModal";
import EditOrderModal from "../components/EditOrderModal";
import CustomEvent from "../components/CustomEvent";
import { fetchOrders, createOrder, updateOrder, deleteOrder } from "../api/OrderService";
import { fetchClients } from "../api/ClientService";
import { fetchProducts } from "../api/ProductService";
import { getAllOrders, addOrder, deleteOrderFromDB } from "../services/database";
import { requestNotificationPermission, scheduleNotification, cancelNotifications } from "../services/notificationService";

const localizer = momentLocalizer(moment);

const Agenda = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) return;

      if (isOnline) {
        try {
          const [orders, clients, products] = await Promise.all([fetchOrders(token), fetchClients(token), fetchProducts(token)]);

          const clientsMap = clients.reduce((map, client) => {
            map[client.id] = `${client.first_name} ${client.last_name}`;
            return map;
          }, {});

          const productsMap = products.reduce((map, product) => {
            map[product.id] = product.title;
            return map;
          }, {});

          const processedOrders = orders.map(order => {
            const orderProducts = order.products.map(p => ({
              id: p.product_id,
              title: productsMap[p.product_id] || "Unknown product",
              quantity: p.quantity || 1,
              price: p.price_at_order || 0,
            }));

            return {
              ...order,
              start: new Date(order.date),
              end: new Date(order.date),
              client_name: clientsMap[order.client_id] || "Not specified",
              products: orderProducts,
              total: orderProducts.reduce((sum, p) => sum + p.price * p.quantity, 0),
            };
          });

          setEvents(processedOrders);
          processedOrders.forEach(order => {
            addOrder(order);
            scheduleNotification(order);
          });
        } catch (error) {
          console.error("Error loading orders:", error);
        }
      } else {
        const localOrders = await getAllOrders();
        setEvents(localOrders);
      }
    };

    loadOrders();
  }, [token, isOnline]);

  const openCreateModal = () => {
    setSelectedOrder(null);
    setModalIsOpen(true);
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditModalIsOpen(true);
  };

  const closeModals = () => {
    setSelectedOrder(null);
    setModalIsOpen(false);
    setEditModalIsOpen(false);
  };

  const handleAddOrUpdateOrder = async (order) => {
    if (!navigator.onLine) {
      alert("No internet connection. Action is not possible.");
      return;
    }

    if (!token) return;

    if (isOnline) {
      try {
        const [updatedProducts, updatedClients] = await Promise.all([
          fetchProducts(token),
          fetchClients(token),
        ]);

        const productsMap = updatedProducts.reduce((map, product) => {
          map[product.id] = { title: product.title, price: product.price };
          return map;
        }, {});

        const clientsMap = updatedClients.reduce((map, client) => {
          map[client.id] = `${client.first_name} ${client.last_name}`;
          return map;
        }, {});

        const formattedDate = moment(order.start).format("YYYY-MM-DDTHH:mm:ssZ");

        const formattedOrder = {
          title: order.title,
          address: order.address,
          date: formattedDate,
          client_id: order.client_id !== "Not specified" ? parseInt(order.client_id) || null : null,
          products: order.products.map(p => ({
            product_id: p.id,
            quantity: p.quantity || 1,
          })),
        };

        let newOrder;
        if (order.id) {
          newOrder = await updateOrder(order.id, formattedOrder, token);
        } else {
          newOrder = await createOrder(formattedOrder, token);
        }

        if (newOrder) {
          const processedOrder = {
            ...newOrder,
            start: new Date(newOrder.date),
            end: new Date(newOrder.date),
            client_name: clientsMap[newOrder.client_id] || "Not specified",
            products: newOrder.products.map(p => ({
              id: p.product_id,
              title: productsMap[p.product_id]?.title || "Unknown product",
              quantity: p.quantity || 1,
              price: p.price_at_order || 0,
            })),
            total: newOrder.products.reduce((sum, p) => sum + (p.price_at_order || 0) * (p.quantity || 1), 0),
          };

          if (order.id) {
            setEvents(events.map(event => (event.id === order.id ? processedOrder : event)));
          } else {
            setEvents([...events, processedOrder]);
          }

          addOrder(processedOrder);
          scheduleNotification(processedOrder);
        }
      } catch (error) {
        console.error("Error creating/updating order:", error);
      }
    } else {
      const tempOrder = { ...order, id: Date.now() };
      setEvents([...events, tempOrder]);
      addOrder(tempOrder);
      scheduleNotification(tempOrder);
    }

    closeModals();
  };

  const handleDeleteOrder = async (orderId) => {
    if (!navigator.onLine) {
      alert("No internet connection. Action is not possible.");
      return;
    }

    if (!token) return;

    if (isOnline) {
      const success = await deleteOrder(orderId, token);
      if (success) {
        setEvents(events.filter(event => event.id !== orderId));
        deleteOrderFromDB(orderId);
        cancelNotifications(orderId);
      }
    } else {
      setEvents(events.filter(event => event.id !== orderId));
      deleteOrderFromDB(orderId);
      cancelNotifications(orderId);
    }

    closeModals();
  };

  return (
      <div className="main-page">
        <button className="add-order-btn" onClick={openCreateModal}>
          Add Order
        </button>

        <div className="agenda-container">
          <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={["agenda"]}
              defaultView="agenda"
              style={{ minHeight: "90%", marginTop: 20 }}
              components={{
                event: (props) => (
                    <div onClick={() => openEditModal(props.event)} style={{ cursor: 'pointer' }}>
                      <CustomEvent {...props} />
                    </div>
                ),
              }}
          />

          <OrderModal isOpen={modalIsOpen} onClose={closeModals} onAddOrder={handleAddOrUpdateOrder} />
          <EditOrderModal isOpen={editModalIsOpen} onClose={closeModals} onUpdateOrder={handleAddOrUpdateOrder} onDeleteOrder={handleDeleteOrder} order={selectedOrder} />
        </div>
      </div>
  );
};

export default Agenda;
