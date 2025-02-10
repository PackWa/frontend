import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import OrderModal from "../components/OrderModal";
import EditOrderModal from "../components/EditOrderModal";
import CustomEvent from "../components/CustomEvent";
import { fetchOrders, createOrder, updateOrder, deleteOrder } from "../api/OrderService";
import { fetchClients } from "../api/ClientService";

const localizer = momentLocalizer(moment);

const Agenda = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) return;
      const [orders, clients] = await Promise.all([fetchOrders(token), fetchClients(token)]);
      
      const clientsMap = clients.reduce((map, client) => {
        map[client.id] = `${client.first_name} ${client.last_name}`;
        return map;
      }, {});
  
      setEvents(orders.map(order => ({
        ...order,
        start: new Date(order.date),
        end: new Date(order.date),
        client_name: clientsMap[order.client_id] || "Не указан",
      })));
    };
    loadOrders();
  }, [token]);
  

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
    if (!token) return;
    const formattedOrder = {
      title: order.title,
      address: order.address,
      date: order.start,
      client_id: order.client_id !== "Не указан" ? parseInt(order.client_id) || null : null,
      products: order.products.map(product => ({
        product_id: product.id,
        quantity: product.quantity || 1,
      }))
    };
    
    if (order.id) {
      const updatedOrder = await updateOrder(order.id, formattedOrder, token);
      if (updatedOrder) {
        setEvents(events.map(evt => (evt.id === order.id ? {
          ...updatedOrder,
          start: new Date(updatedOrder.date),
          end: new Date(updatedOrder.date),
        } : evt)));
      }
    } else {
      const createdOrder = await createOrder(formattedOrder, token);
      if (createdOrder) {
        setEvents([...events, {
          ...createdOrder,
          start: new Date(createdOrder.date),
          end: new Date(createdOrder.date),
        }]);
      }
    }
    closeModals();
  };

  const handleDeleteOrder = async (orderId) => {
    if (!token) return;
    const success = await deleteOrder(orderId, token);
    if (success) {
      const updatedOrders = await fetchOrders(token);
      setEvents(updatedOrders.map(order => ({
        ...order,
        start: new Date(order.date),
        end: new Date(order.date),
      })));
      closeModals();
    }
  };
  

  return (
    <div className="agenda-container">
      <h2>Расписание заказов</h2>

      <button className="add-order-btn" onClick={openCreateModal}>
        Добавить заказ
      </button>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["agenda"]}
        defaultView="agenda"
        style={{ height: 500, marginTop: 20 }}
        components={{ event: (props) => (
          <div onClick={() => openEditModal(props.event)} style={{ cursor: 'pointer' }}>
            <CustomEvent {...props} />
          </div>
        ) }}
      />

      <OrderModal isOpen={modalIsOpen} onClose={closeModals} onAddOrder={handleAddOrUpdateOrder} />
      <EditOrderModal isOpen={editModalIsOpen} onClose={closeModals} onUpdateOrder={handleAddOrUpdateOrder} onDeleteOrder={handleDeleteOrder} order={selectedOrder} />
    </div>
  );
};

export default Agenda;