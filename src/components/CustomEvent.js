import React from "react";
import moment from "moment";

const CustomEvent = ({ event }) => {
  return (
    <div className="custom-event">
      <strong>{event.title}</strong>
      <div>Клиент: {event.client}</div>
      <div>Адрес: {event.address}</div>
      <div>Время: {moment(event.start).format("HH:mm")}</div>
      <div>Продукты:</div>
      <ul>
        {event.products.map((product) => (
          <li key={product.id}>
            {product.name} — {product.quantity || 1} шт.
          </li>
        ))}
      </ul>
      <div>Итого: {event.total} ₽</div>
    </div>
  );
};

export default CustomEvent;