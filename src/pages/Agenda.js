import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import OrderModal from "../components/OrderModal";
import CustomEvent from "../components/CustomEvent";
import { fetchOrders, createOrder, updateOrder, deleteOrder } from "../api/OrderService";

const localizer = momentLocalizer(moment);

const Agenda = ({ token }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      const orders = await fetchOrders(token);
      setEvents(orders.map(order => ({
        ...order,
        start: new Date(order.date),
        end: new Date(order.date),
      })));
    };
    loadOrders();
  }, [token]);

  const openModal = (order = null) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setSelectedOrder(null);
    setModalIsOpen(false);
  };

  const handleAddOrUpdateOrder = async (order) => {
    if (order.id) {
      const updatedOrder = await updateOrder(order.id, order, token);
      if (updatedOrder) {
        setEvents(events.map(evt => (evt.id === order.id ? {
          ...updatedOrder,
          start: new Date(updatedOrder.date),
          end: new Date(updatedOrder.date),
        } : evt)));
      }
    } else {
      const createdOrder = await createOrder(order, token);
      if (createdOrder) {
        setEvents([...events, {
          ...createdOrder,
          start: new Date(createdOrder.date),
          end: new Date(createdOrder.date),
        }]);
      }
    }
    closeModal();
  };

  const handleDeleteOrder = async (orderId) => {
    const success = await deleteOrder(orderId, token);
    if (success) {
      setEvents(events.filter(event => event.id !== orderId));
    }
  };

  return (
    <div className="agenda-container">
      <h2>Расписание заказов</h2>

      <button className="add-order-btn" onClick={() => openModal()}>
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
          <CustomEvent {...props} onEdit={() => openModal(props.event)} onDelete={() => handleDeleteOrder(props.event.id)} />
        ) }}
      />

      <OrderModal isOpen={modalIsOpen} onClose={closeModal} onAddOrder={handleAddOrUpdateOrder} order={selectedOrder} />
    </div>
  );
};

export default Agenda;
