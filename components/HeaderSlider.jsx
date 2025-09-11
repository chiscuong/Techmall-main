"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assets } from "@/assets/assets";
import Link from "next/link";

const sliderData = [
  {
    id: 1,
    title: "Experience innovation perfected with iPhone 16.",
    offer: "Limited Time Offer 10% Off",
    buttonText1: "Buy now",
    buttonText2: "Find more",
    videoSrc: assets.videoBanner1,
    buttonLink1: "/product/68bc1a04abc09ce310697f24",
    buttonLink2: "/all-products",
  },
  {
    id: 2,
    title: "MacBook Air: Ultra-thin, ultra-fast, ultra-you.",
    offer: "Hurry up only few lefts!",
    buttonText1: "Shop Now",
    buttonText2: "Explore Deals",
    videoSrc: assets.videoBanner2,
    buttonLink1: "/product/68bc16b9abc09ce310697e28",
    buttonLink2: "/all-products",
  },
];

const HeaderSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderData.length) % sliderData.length
    );
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-xl top-8">
      <AnimatePresence mode="wait">
        {sliderData.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                {/* Video Background - Full container */}
                <video
                  src={slide.videoSrc}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Overlay gradient để text dễ đọc */}
                <div className="absolute inset-0 bg-gradient-to-r from-p-950/80 via-p-900/60 to-p-800/40"></div>

                {/* Text content overlay */}
                <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16">
                  <div className="max-w-2xl z-10">
                    <motion.h2
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
                    >
                      {slide.title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-xl md:text-2xl text-p-100 mb-8 font-medium"
                    >
                      {slide.offer}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      {/* Button 1 using Link */}
                      <Link href={slide.buttonLink1}>
                        <button className="px-8 py-4 bg-white text-p-900 rounded-xl hover:bg-p-50 transition-all duration-300 transform hover:scale-105 shadow-2xl font-bold text-lg">
                          {slide.buttonText1}
                        </button>
                      </Link>

                      {/* Button 2 using Link */}
                      <Link href={slide.buttonLink2}>
                        <button className="px-8 py-4 border-2 border-white text-white bg-p-800/30 backdrop-blur-md rounded-xl hover:bg-white/20 hover:border-p-200 transition-all duration-300 transform hover:scale-105 shadow-2xl font-bold text-lg">
                          {slide.buttonText2}
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <ChevronRight size={24} />
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {sliderData.map((_, idx) => (
          <button
            key={idx}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              currentSlide === idx
                ? "bg-white shadow-lg scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
