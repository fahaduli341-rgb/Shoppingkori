import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight, Truck, ShieldCheck, Tag } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Shop from Home',
      subtitle: 'Every daily essential in one place',
      cta: 'Start shopping',
      tag: 'Everyday Essentials',
      gradient: 'from-amber-100 via-orange-50 to-stone-100',
      illustration: 'sun'
    },
    {
      title: 'Mega Flash Deals',
      subtitle: 'Up to 20% off on electronics & cookware',
      cta: 'View offers',
      tag: 'Special Promo',
      gradient: 'from-emerald-50 via-teal-50 to-stone-100',
      illustration: 'sparkle'
    },
    {
      title: 'Cash on Delivery',
      subtitle: 'Delivered securely anywhere across Bangladesh',
      cta: 'Explore store',
      tag: 'Nationwide Delivery',
      gradient: 'from-orange-100 via-amber-50 to-stone-100',
      illustration: 'truck'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-2">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${slide.gradient} p-6 sm:p-10 md:p-12 transition-all duration-500 shadow-sm border border-stone-200/70 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between`}
      >
        {/* Background Decorative Illustrations */}
        <div className="absolute -right-8 -top-8 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-amber-200/50 blur-2xl pointer-events-none" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden sm:block opacity-70 pointer-events-none">
          {currentSlide === 0 && (
            <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-amber-400/40 to-orange-300/60 flex items-center justify-center shadow-inner">
              <div className="w-32 h-32 rounded-full bg-amber-100/80 flex items-center justify-center">
                <Tag className="w-14 h-14 text-orange-600/70 stroke-[1.5]" />
              </div>
            </div>
          )}
          {currentSlide === 1 && (
            <div className="w-40 h-40 rounded-3xl bg-emerald-200/50 rotate-12 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-emerald-700/60" />
            </div>
          )}
          {currentSlide === 2 && (
            <div className="w-40 h-40 rounded-full bg-orange-200/60 flex items-center justify-center">
              <Truck className="w-16 h-16 text-orange-700/60" />
            </div>
          )}
        </div>

        {/* Foreground Inset Content Card (Matches the exact Screenshot_20260916-121132 layout) */}
        <div className="relative z-10 max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/80">
          <span className="inline-block px-2.5 py-1 mb-3 text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 rounded-full">
            {slide.tag}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {slide.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            {slide.subtitle}
          </p>

          <button
            id="hero-start-shopping-btn"
            onClick={() => {
              setSelectedCategory('All');
              setCurrentView('products');
            }}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-600/25 transition-all cursor-pointer"
          >
            <span>{slide.cta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Slider Indicator Dots (Matching screenshots: capsule dot indicators) */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-orange-600' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
