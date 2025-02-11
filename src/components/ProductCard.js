import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import photo from '../assets/camera_placeholder.jpg';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const [imageSrc, setImageSrc] = useState(photo);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            try {
                if (product.image) {
                    setImageSrc(product.image);
                    setIsLoading(false);
                    return;
                }

                if (product.photo) {
                    const img = new Image();
                    img.src = product.photo;

                    img.onload = () => {
                        if (isMounted) {
                            setImageSrc(product.photo);
                            setIsLoading(false);
                        }
                    };

                    img.onerror = () => {
                        if (isMounted) setImageSrc(photo);
                    };
                }
            } catch (error) {
                if (isMounted) setImageSrc(photo);
            }
        };

        loadImage();

        return () => {
            isMounted = false;
        };
    }, [product.photo, product.image]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        const imgElement = document.getElementById(`product-img-${product.id}`);
        if (imgElement) {
            observer.observe(imgElement);
        }

        return () => {
            if (imgElement) observer.unobserve(imgElement);
        };
    }, [product.id]);

    return (
        <div className="product-card">
            <div className={`image-container ${isLoading ? 'loading' : 'loaded'}`}>
                <img src={imageSrc} alt={product.title} loading="lazy" />
                {isLoading && <div className="image-loading"></div>}
            </div>
            <div className="content">
                <h3>title: {product.title}</h3>
                <p>description: {product.description}</p>
                <p className="price">price: {product.price} ₽</p>
                <div className="actions">
                    <button onClick={onEdit}>Редактировать</button>
                    <button onClick={() => onDelete(product.id)}>Удалить</button>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        photo: PropTypes.string,
        image: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default React.memo(ProductCard);