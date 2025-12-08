// src/components/home/AuctionSection.tsx
import React from "react";
import ProductCarousel from "../ProductCarousel";

const AuctionSection: React.FC<{ title?: string; items: any[] }> = ({ title = "Hot Auctions", items = [] }) => {
  return <ProductCarousel title={title} items={items} />;
};

export default AuctionSection;
