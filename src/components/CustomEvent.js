import React from "react";
import moment from "moment";

const CustomEvent = ({ event }) => {
    return (
        <div className="custom-event">
            <strong>{event.title}</strong>
            <div>Client: {event.client_name}</div>
            <div>Address: {event.address}</div>
            <div>Time: {moment(event.start).format("HH:mm")}</div>
            <div>Products:</div>
            <ul>
                {event.products.map((product) => (
                    <li key={product.id}>
                        {product.title} — {product.quantity || 1} pcs.
                    </li>
                ))}
            </ul>
            <div>Total: {event.total} ₽</div>
        </div>
    );
};

export default CustomEvent;