import React from 'react';

const SkeletonProductCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image animate-pulse"></div>
            <div className="skeleton-content">
                <div className="skeleton-title animate-pulse"></div>
                <div className="skeleton-text animate-pulse"></div>
                <div className="skeleton-price animate-pulse"></div>
                <div className="skeleton-actions">
                    <div className="skeleton-button animate-pulse"></div>
                    <div className="skeleton-button animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;