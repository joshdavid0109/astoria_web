// src/components/home/FlashDealsSection.tsx
import React from "react";
import ProductCarousel from "../ProductCarousel";

const FlashDealsSection: React.FC<{ items: any[] }> = ({ items = [] }) => {
  if (!items.length) return null;
  return <ProductCarousel title="Flash Deals" items={items.map(f => ({ ...f.product, flash: f }))} />;
};

export default FlashDealsSection;
