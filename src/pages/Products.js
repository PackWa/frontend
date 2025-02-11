import React, { useState, useEffect } from "react";
import {fetchProducts, createProduct, updateProduct, deleteProduct, fetchProductPhoto} from "../api/ProductService";
import {
  getAllProducts,
  getPhotoFromIndexedDB,
  savePhotoToIndexedDB,
  blobToBase64,
  addProductDB,
  updateProductDB,
  deleteProductDB,
  clearProducts
} from "../services/database";
import AddProductModal from "../components/AddProductModal";
import photo from "../assets/camera_placeholder.jpg";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem("access_token");

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const offlineProducts = await getAllProducts();
            if (offlineProducts.length > 0) setProducts(offlineProducts);

            if (navigator.onLine) {
                try {
                    const productsData = await fetchProducts(token);
                    const updatedProducts = await Promise.all(
                        productsData.map(async (product) => {
                            if (!product.photo) return product;

                            try {
                                let base64Photo = await getPhotoFromIndexedDB(product.photo);
                                if (!base64Photo) {
                                    const photoBlob = await fetchProductPhoto(token, product.photo);
                                    base64Photo = await blobToBase64(photoBlob);
                                    await savePhotoToIndexedDB(product.photo, base64Photo);
                                }
                                return { ...product, photo: base64Photo };
                            } catch (error) {
                                console.error("Ошибка фото:", error);
                                return product;
                            }
                        })
                    );

                    setProducts(updatedProducts);
                    await clearProducts();
                    await Promise.all(updatedProducts.map(p => addProductDB(p)));
                } catch (error) {
                    console.error("Ошибка загрузки:", error);
                }
            }
            setLoading(false);
        };

        loadProducts();
    }, [token]);

    const handleAddProduct = async (formData) => {
        console.log("FORM DATA CREATE PRODUCT", formData);
        try {
            const createdProduct = await createProduct(formData, token);
            if (createdProduct) {
                if (createdProduct.photo) {
                    try {
                        const photoBlob = await fetchProductPhoto(token, createdProduct.photo);
                        const base64Photo = await blobToBase64(photoBlob);
                        await savePhotoToIndexedDB(createdProduct.photo, base64Photo);
                        createdProduct.photo = base64Photo;
                    } catch (error) {
                        console.error("Ошибка загрузки фото:", error);
                    }
                }
                setProducts(prev => [...prev, createdProduct]);
                await addProductDB(createdProduct);
            }
        } catch (error) {
            console.error("Ошибка создания продукта:", error);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setEditModalOpen(true);
    };

    const handleUpdateProduct = async (updatedProduct) => {
        if (!navigator.onLine) {
            alert("Нет интернет-соединения. Действие невозможно.");
            return;
        }

        try {
            const updated = await updateProduct(editingProduct.id, updatedProduct, token);
            if (updated) {
                if (updated.photo && updated.photo !== editingProduct.photo) {
                    try {
                        const photoBlob = await fetchProductPhoto(token, updated.photo);
                        const base64Photo = await blobToBase64(photoBlob);
                        await savePhotoToIndexedDB(updated.photo, base64Photo);
                        updated.photo = base64Photo;
                    } catch (error) {
                        console.error("Ошибка загрузки фото:", error);
                    }
                } else {
                    updated.photo = editingProduct.photo; // Оставляем старую фотографию
                }

                setProducts(prev =>
                    prev.map(p => p.id === updated.id ? updated : p)
                );
                await updateProductDB(updated);
            }
            setEditModalOpen(false);
        } catch (error) {
            console.error("Ошибка обновления продукта:", error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!navigator.onLine) {
            alert("Нет интернет-соединения. Действие невозможно.");
            return;
        }
        try {
            await deleteProduct(id, token);
            setProducts(prev => prev.filter(p => p.id !== id));
            await deleteProductDB(id);
        } catch (error) {
            console.error("Ошибка удаления:", error);
        }
    };

  if (loading) return <div>Загрузка...</div>;


  return (
      <div className="products-container">
        <h2>Продукты</h2>
        <button className="add-product" onClick={() => setAddModalOpen(true)}>
          Добавить продукт
        </button>

        <div className="products-grid">
          {products.map((product) => (
              <div key={product.id} className="product-card">
                {/* Проверка, есть ли фотография у продукта */}
                {product.photo ? (
                    <img
                        src={product.photo || photo } // Заглушка до загрузки
                        alt={product.title}
                    />
                ) : (
                    <img
                        src={`${photo}`} // Заглушка до загрузки
                        alt={"Нет фотографии"}
                    />
                )}
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>{product.price} ₽</p>
                <button onClick={() => handleEditProduct(product)}>Редактировать</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
              </div>
          ))}
        </div>

        <AddProductModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSave={handleAddProduct}
        />

        <AddProductModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSave={handleUpdateProduct}
            product={editingProduct}
        />
      </div>
  );
};

export default Products;
