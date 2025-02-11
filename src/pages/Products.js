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
import ProductCard from "../components/ProductCard";
import SkeletonProductCard from "../components/SkeletonProductCard";
import SearchBar from "../components/SearchBar";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem("access_token");

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                setLoading(true);

                // Шаг 1: Загружаем кэшированные данные
                const offlineProducts = await getAllProducts();
                if (isMounted && offlineProducts.length > 0) {
                    setProducts(offlineProducts);
                }

                // Шаг 2: Если онлайн - загружаем свежие данные
                if (navigator.onLine) {
                    try {
                        const serverProducts = await fetchProducts(token);

                        // Обработка фотографий
                        const processedProducts = await Promise.all(
                            serverProducts.map(async (product) => {
                                // Проверяем есть ли фото в кэше
                                const cachedProduct = offlineProducts.find(p => p.id === product.id);

                                if (cachedProduct?.photo === product.photo && cachedProduct.image) {
                                    return { ...product, image: cachedProduct.image };
                                }

                                if (product.photo) {
                                    try {
                                        const photoBlob = await fetchProductPhoto(token, product.photo);
                                        const base64 = await blobToBase64(photoBlob);
                                        return { ...product, image: base64 };
                                    } catch (error) {
                                        console.error("Error loading photo:", error);
                                        return product;
                                    }
                                }
                                return product;
                            })
                        );

                        // Шаг 3: Обновляем состояние и кэш
                        if (isMounted) {
                            setProducts(processedProducts);
                            await clearProducts();
                            await Promise.all(processedProducts.map(p => addProductDB(p)));
                        }
                    } catch (error) {
                        console.error("Ошибка загрузки продуктов:", error);
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadProducts();
        return () => { isMounted = false };
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
                        createdProduct.image = base64Photo;
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
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} text={"🔍 search"} /> {/* Добавляем компонент поиска */}
        <button className="add-product" onClick={() => setAddModalOpen(true)}>
          Добавить продукт
        </button>

          <div className="products-grid">
              {loading ? (
                  // Показываем 6 скелетонов во время загрузки
                  Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonProductCard key={`skeleton-${i}`} />
                  ))
              ) : (
                  filteredProducts.map(product => (
                      <ProductCard
                          key={product.id}
                          product={product}
                          onEdit={() => {
                              setEditingProduct(product);
                              setEditModalOpen(true);
                          }}
                          onDelete={handleDeleteProduct}
                      />
                  ))
              )}
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
