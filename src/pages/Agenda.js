import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import OrderModal from "../components/OrderModal";
import CustomEvent from "../components/CustomEvent";

const localizer = momentLocalizer(moment);

const Agenda = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleAddOrder = (newOrder) => {
    setEvents([...events, newOrder]);
    closeModal();
  };

  return (
    <div className="agenda-container">
      <h2>Расписание заказов</h2>

      <button className="add-order-btn" onClick={openModal}>
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
        components={{
          event: CustomEvent, // Используем кастомный компонент для отображения событий
        }}
      />

      <OrderModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        onAddOrder={handleAddOrder}
      />
    </div>
  );
};

export default Agenda;