import React from 'react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`Added ${product.title} to cart`);
  };

  return (
    <div className="glass-panel p-4 flex flex-col transition-all hover:shadow-neon">
      <div className="h-32 bg-black/50 rounded flex items-center justify-center mb-3 border border-neon-green/20">
        <span className="text-4xl">🔌</span>
      </div>
      <h3 className="text-lg font-bold text-neon-green">{product.title}</h3>
      <p className="text-sm text-gray-400 mt-1">{product.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {product.tags?.map(tag => (
          <span key={tag} className="text-xs bg-neon-green/20 px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xl font-mono">Rs. {product.price}</span>
        <button onClick={handleAddToCart} className="neon-button text-sm py-1">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;