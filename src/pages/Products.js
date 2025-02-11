import React, { useState, useEffect } from "react";
import {fetchProducts, createProduct, updateProduct, deleteProduct, fetchProductPhoto} from "../api/ProductService";
import {
  getAllProducts,
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

            // Загружаем оффлайн продукты
            const offlineProducts = await getAllProducts();
            if (offlineProducts.length > 0) {
                setProducts(offlineProducts);
            }

            // Если онлайн, получаем свежие данные с сервера
            if (navigator.onLine) {
                try {
                    const productsData = await fetchProducts(token);
                    const updatedProducts = await Promise.all(
                        productsData.map(async (product) => {
                            // Если у продукта нет фотографии, возвращаем его без изменений
                            if (!product.photo) return product;

                            // Попытаемся найти оффлайн-версию по id
                            const offlineProduct = offlineProducts.find(p => p.id === product.id);

                            // Если оффлайн-версия найдена,
                            // и её photo совпадает с тем, что пришло с сервера,
                            // и у неё уже есть сохранённое изображение (image),
                            // то используем локальное image.
                            if (
                                offlineProduct &&
                                offlineProduct.photo === product.photo &&
                                offlineProduct.image
                            ) {
                                return { ...product, image: offlineProduct.image };
                            } else {
                                // Иначе — загружаем новую фотографию с сервера
                                try {
                                    const photoBlob = await fetchProductPhoto(token, product.photo);
                                    const base64Photo = await blobToBase64(photoBlob);
                                    // Обновляем объект продукта, добавляя поле image с новыми данными
                                    return { ...product, image: base64Photo };
                                } catch (error) {
                                    console.error("Ошибка загрузки фото:", error);
                                    return product;
                                }
                            }
                        })
                    );

                    setProducts(updatedProducts);
                    // Очищаем старые записи и сохраняем обновлённые продукты в IndexedDB
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
                        // Обновляем поле image в объекте продукта
                        updated.image = base64Photo;
                    } catch (error) {
                        console.error("Ошибка загрузки фото:", error);
                    }
                } else {
                    // Если фотография не изменилась, оставляем локальное значение image
                    updated.image = editingProduct.image;
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
                        src={product.image || photo } // Заглушка до загрузки
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
