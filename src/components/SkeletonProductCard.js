import React from 'react';

const ProductSkeletonCard = () => {
    return (
        <div className="product-skeleton-card">
            <div className="product-skeleton-image animate-pulse"></div>
            <div className="product-skeleton-content">
                <div className="product-skeleton-title animate-pulse"></div>
                <div className="product-skeleton-text animate-pulse"></div>
                <div className="product-skeleton-price animate-pulse"></div>
                <div className="product-skeleton-actions">
                    <div className="product-skeleton-button animate-pulse"></div>
                    <div className="product-skeleton-button animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeletonCard;