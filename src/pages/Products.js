/**
 * Products Component
 *
 * This component is responsible for displaying and managing a list of products.
 * It supports CRUD operations (Create, Read, Update, Delete) for products and
 * synchronizes data between a local database and a remote server.
 *
 * Features:
 * - Fetches product data from the local database and updates it from the server if online.
 * - Displays products in a grid format with support for searching.
 * - Allows users to add, edit, and delete products (only in online mod).
 * - Handles offline mode by caching products and synchronizing changes when online.
 * - Supports product images, converting blobs to base64 for local storage.
 *
 * Dependencies:
 * - Uses ProductService for API requests.
 * - Uses a local database service for offline support.
 * - Includes UI components for displaying and managing products.
 */


import React, { useState, useEffect } from "react";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProductPhoto
} from "../api/ProductService";
import {
    getAllProducts,
    blobToBase64,
    addProductDB,
    updateProductDB,
    deleteProductDB,
    clearProducts
} from "../services/database";
import AddProductModal from "../components/AddProductModal";
import ProductCard from "../components/ProductCard";
import SkeletonProductCard from "../components/SkeletonProductCard";
import SearchBar from "../components/SearchBar";

const Products = () => {
    const [searchQuery, setSearchQuery] = useState("");
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

                const offlineProducts = await getAllProducts();
                if (isMounted && offlineProducts.length > 0) {
                    setProducts(offlineProducts);
                }

                if (navigator.onLine) {
                    try {
                        const serverProducts = await fetchProducts(token);

                        const processedProducts = await Promise.all(
                            serverProducts.map(async (product) => {
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

                        if (isMounted) {
                            setProducts(processedProducts);
                            await clearProducts();
                            await Promise.all(processedProducts.map(p => addProductDB(p)));
                        }
                    } catch (error) {
                        console.error("Error loading products:", error);
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadProducts();
        return () => { isMounted = false };
    }, []);

    const handleAddProduct = async (formData) => {
        try {
            const createdProduct = await createProduct(formData, token);
            if (createdProduct) {
                if (createdProduct.photo) {
                    try {
                        const photoBlob = await fetchProductPhoto(token, createdProduct.photo);
                        const base64Photo = await blobToBase64(photoBlob);
                        createdProduct.image = base64Photo;
                    } catch (error) {
                        console.error("Error loading photo:", error);
                    }
                }
                setProducts(prev => [...prev, createdProduct]);
                await addProductDB(createdProduct);
            }
        } catch (error) {
            if (error.response.data.title === "Product`s title already exists for this user") {
                alert("You can`t have 2 products with the same name")
            }
        }
    };

    const handleUpdateProduct = async (updatedProduct) => {
        if (!navigator.onLine) {
            alert("No internet connection. Action not possible.");
            return;
        }

        try {
            const updated = await updateProduct(editingProduct.id, updatedProduct, token);
            if (updated) {
                if (updated.photo && updated.photo !== editingProduct.photo) {
                    try {
                        const photoBlob = await fetchProductPhoto(token, updated.photo);
                        const base64Photo = await blobToBase64(photoBlob);
                        updated.image = base64Photo;
                    } catch (error) {
                        console.error("Error loading photo:", error);
                    }
                } else {
                    updated.image = editingProduct.image;
                }

                setProducts(prev =>
                    prev.map(p => p.id === updated.id ? updated : p)
                );
                await updateProductDB(updated);
            }
            setEditModalOpen(false);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!navigator.onLine) {
            alert("No internet connection. Action not possible.");
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to delete this product?");
        if (!isConfirmed) return;

        try {
            await deleteProduct(id, token);
            setProducts(prev => prev.filter(p => p.id !== id));
            await deleteProductDB(id);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="products-container">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} text={"🔍 Search"} />
            <button className="add-product" onClick={() => setAddModalOpen(true)}>
                Add Product
            </button>

            <div className="products-grid">
                {loading ? (
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
