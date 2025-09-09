"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Mail,
  Plus,
  Package,
  ShoppingCart,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Add Product", path: "/seller", icon: Plus },
    { name: "Product List", path: "/seller/product-list", icon: Package },
    { name: "Orders", path: "/seller/orders", icon: ShoppingCart },
    { name: "Messages", path: "/seller/messages", icon: Mail },
  ];

  // Function to check if menu item is active
  const isMenuItemActive = (itemPath) => {
    // Exact match trước
    if (pathname === itemPath) {
      return true;
    }

    // Cho các sub-routes (không bao gồm /seller root)
    if (itemPath !== "/seller" && pathname.startsWith(itemPath + "/")) {
      return true;
    }

    return false;
  };

  return (
    <nav className="relative w-full bg-white border-b border-p-200 shadow-sm px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold bg-gradient-to-r from-p-400 via-p-500 to-p-800 text-transparent bg-clip-text hover:scale-105 transition-transform duration-200"
        >
          TechMall
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-center gap-2 flex-1 max-w-2xl mx-8">
          {menuItems.map((item) => {
            const isActive = isMenuItemActive(item.path);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-sc-500/15 to-sc-600/10 text-sc-600 border-2 border-sc-500/20 shadow-sm"
                    : "hover:bg-gradient-to-r hover:from-p-100 hover:to-p-50 text-gray-600 hover:text-p-600 hover:shadow-sm border-2 border-transparent"
                }`}
              >
                <IconComponent
                  size={18}
                  className={`${isActive ? "text-sc-500" : ""}`}
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-p-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>

          {/* Logout Button */}
          <Link
            href="/"
            className="flex items-center gap-2 bg-gradient-to-r from-p-400 to-p-800 shadow-lg hover:shadow-xl text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-all duration-200"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg md:hidden border border-p-200 z-50 mx-4 mt-2 overflow-hidden">
            <div className="py-2">
              {menuItems.map((item, index) => {
                const isActive = isMenuItemActive(item.path);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                      isActive
                        ? "bg-sc-500/10 text-sc-600 font-semibold"
                        : "hover:bg-p-50 text-gray-700 hover:text-p-600"
                    } ${
                      index !== menuItems.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isActive ? "bg-sc-500/20" : "bg-gray-100"
                      }`}
                    >
                      <IconComponent
                        size={20}
                        className={`${
                          isActive ? "text-sc-500" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <span className="text-base">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
