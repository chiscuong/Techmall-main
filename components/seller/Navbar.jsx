"use client";

import React, { useState } from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    { name: "Messages", path: "/seller/messages", icon: assets.message_icon },
  ];

  return (
    <nav className="w-full bg-white border-b border-p-200 px-4 md:px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-3xl font-bold bg-gradient-to-r from-p-400 via-p-500 to-p-800 text-transparent bg-clip-text">
        TechMall
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center justify-center gap-6 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded ${
                isActive
                  ? "bg-sc-500/10 border-b-2 border-sc-500"
                  : "hover:bg-p-200/90"
              }`}
            >
              <Image
                src={item.icon}
                alt={`${item.name}_icon`}
                className="w-5 h-5"
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Right side - Hamburger (mobile) + Logout (all screens) */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger - chỉ hiện trên mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-p-200/30"
        >
          <Image src={assets.menu_icon} alt="menu" className="w-6 h-6" />
        </button>

        {/* Logout Button - hiện trên tất cả màn hình */}
        <button className="bg-gradient-to-r from-p-400 to-p-800 shadow-lg hover:shadow-2xl text-neu-700 hover:text-white px-4 py-2 rounded-full text-xs sm:text-sm">
          <a href="/">Logout</a>
        </button>
      </div>

      {/* Mobile Menu Dropdown - chỉ hiện khi isMobileMenuOpen = true */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col md:hidden border-b border-p-200 z-50">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-3 border-b border-gray-200 ${
                  isActive ? "bg-sc-500/10 font-semibold" : "hover:bg-p-200/30"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Image
                  src={item.icon}
                  alt={`${item.name}_icon`}
                  className="w-5 h-5"
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
