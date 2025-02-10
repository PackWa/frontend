import React from "react";

const ProductList = ({ products, onUpdateQuantity, onRemoveProduct }) => {
  return (
    <div className="selected-products">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <div className="product-image-container">
            <img
              src={URL.createObjectURL(product.image)} // Используем URL.createObjectURL
              alt={product.name}
              className="product-img"
            />
          </div>
          <div>
            <span>
              {product.name} — {product.price} ₽
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