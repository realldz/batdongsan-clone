'use client';

import React, { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
}

export const PropertyGallery = ({ images }: PropertyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full mb-6">
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Chưa có hình ảnh</span>
          </div>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full mb-6">
      {/* Main Image Slider */}
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden group">
        <Image 
          src={images[currentIndex]} 
          alt={`Bất động sản hình ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 70vw"
        />
        
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Counter Overlay */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded backdrop-blur-sm z-10">
          {currentIndex + 1}/{images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 lg:gap-4 mt-2 lg:mt-4 overflow-x-auto hide-scrollbar pb-2">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-20 h-16 lg:w-32 lg:h-24 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-colors ${
              idx === currentIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image 
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
