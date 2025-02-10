import React, { useState, useEffect } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchProductPhoto } from "../api/ProductService";
import AddProductModal from "../components/AddProductModal";

const Products = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      const productsData = await fetchProducts(token);
      setProducts(productsData);
    };
    loadProducts();
  }, [token]);

  const handleAddProduct = async (newProduct) => {
    const createdProduct = await createProduct(newProduct, token);
    if (createdProduct) {
      setProducts([...products, createdProduct]);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    const updated = await updateProduct(updatedProduct.id, updatedProduct, token);
    if (updated) {
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    }
    setEditModalOpen(false);
  };

  const handleDeleteProduct = async (id) => {
    const success = await deleteProduct(id, token);
    if (success) {
      setProducts(products.filter((product) => product.id !== id));
    }
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
            <img src={fetchProductPhoto(product.photo)} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price} ₽</p>
            <button onClick={() => handleEditProduct(product)}>Редактировать</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
          </div>
        ))}
      </div>

      <AddProductModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleAddProduct} />
      <AddProductModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleUpdateProduct} product={editingProduct} />

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