import React from "react";
import placeholderImage from "../assets/camera_placeholder.jpg";

const ProductList = ({ products, onUpdateQuantity, onRemoveProduct }) => {
  return (
    <div className="selected-products">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <div className="product-image-container">
          {product.photo ? (
            <img
              src={product.image}
              alt={product.title}
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
            />
          ) : (
            <img
              src={placeholderImage}
              alt="Фото отсутствует"
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
            />
          )}
          </div>
          <div>
            <span>
              {product.title} — {product.price} ₽
            </span>
            <input
              type="number"
              min="1"
              value={product.quantity || 1}
              onChange={(e) => onUpdateQuantity(product.id, parseInt(e.target.value))}
            />
          </div>
          <button type="button" onClick={() => onRemoveProduct(product.id)}>
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;