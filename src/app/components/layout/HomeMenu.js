'use client';
import SectionHeaders from "./SectionHeaders";
import MenuItem from "./Menu/MenuItem";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function HomeMenu() {
  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setBestSellers(menuItems.slice(-3));
      });
    });
  }, []);

  return (
    <section className="relative py-12">
      {/* Full-width container for background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Left decorative image */}
        <div className="hidden md:block absolute left-0 -top-[40px]">
          <Image 
            src={'/sallad1.png'} 
            width={109} 
            height={189}  
            alt={'salad'}
            className="max-w-none"
          />
        </div>
        {/* Right decorative image */}
        <div className="hidden md:block absolute right-0 -top-[20px]">
          <Image 
            src={'/Foood-PNG.png'} 
            width={107} 
            height={195} 
            alt={'food'}
            className="max-w-none"
          />
        </div>
      </div>

      {/* Content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <SectionHeaders
            subHeader={'check out'}
            mainHeader={'Our Best Sellers'} 
          />
        </div>

        {/* Menu items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {bestSellers?.length > 0 && bestSellers.map(item => (
            <MenuItem key={item._id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}