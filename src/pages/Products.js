import React, { useState, useEffect } from "react";
import { getAllProducts, addProduct } from "../services/database";
import AddProductModal from "../components/AddProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getAllProducts();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (newProduct) => {
    const productWithId = { ...newProduct, id: Date.now() };
    await addProduct(productWithId);
    setProducts([...products, productWithId]);
  };

  return (
    <div className="products-container">
      <h2>Продукты</h2>
      <button className="add-product" onClick={() => setAddModalOpen(true)}>
        Добавить продукт
      </button>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={URL.createObjectURL(product.image)} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddProduct}
      />

      <style jsx="true">{`
        .products-container {
          padding: 80px 20px 20px;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }
        .add-product {
          padding: 10px 15px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          justify-content: center;
        }
        .product-card {
          background: #fff;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 300px; /* Ограничиваем ширину карточки */
          margin: 0 auto; /* Центрируем карточку */
        }
        .product-card img {
          width: 100%;
          height: 200px; /* Фиксированная высота для изображения */
          object-fit: cover; /* Сохраняем пропорции изображения */
          border-radius: 10px;
        }
        .product-card h3 {
          margin: 10px 0;
          font-size: 18px;
        }
        .product-card p {
          margin: 5px 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Products;