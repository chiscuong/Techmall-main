"use client";
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { Menu, X, ShoppingCart, Package } from "lucide-react";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="relative z-[100] flex items-center justify-between px-6 md:px-16 lg:px-32 py-4 border-b border-p-200 bg-gradient-to-r from-p-300/10 via-p-300 to-p-300/20">
      {/* Logo */}
      <div>
        <a href="/" className=" text-3xl underline-center ">
          <h2 className="bg-gradient-to-r from-p-400 via-p-500 to-p-800 text-transparent bg-clip-text font-bold ">
            TechMall
          </h2>
        </a>
      </div>

      {/* Desktop Nav */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-p-500 transition underline-center">
          Home
        </Link>
        <Link href="/all-products" className="underline-center">
          Shop
        </Link>
        <Link
          href="/aboutus"
          className="hover:text-p-500 underline-center transition"
        >
          About Us
        </Link>
        <Link
          href="/contact"
          className="hover:text-p-500 underline-center transition"
        >
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs shadow-xl px-4 py-1.5 rounded-full bg-gradient-to-l from-p-400 via-p-500 to-p-600 hover:text-p-200"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />

        {user ? (
          <UserButton
            afterSignOutUrl="/"
<<<<<<< HEAD
=======
            userProfileMode="navigation"
            userProfileUrl="/user-profile"
>>>>>>> 7229a53716edf37d8dbe4c2f36237be3a0ea9108
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8",
                userButtonPopoverCard: "shadow-lg border",
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Cart"
                labelIcon={<ShoppingCart size={16} />}
                href="/cart"
              />
              <UserButton.Link
                label="My Orders"
                labelIcon={<Package size={16} />}
                href="/my-orders"
              />
<<<<<<< HEAD
              <UserButton.Action
                label="Manage Account"
                action="manageAccount"
              />
=======
              <UserButton.Action label="manageAccount" />
>>>>>>> 7229a53716edf37d8dbe4c2f36237be3a0ea9108
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      {/* Mobile Right */}
      <div className="flex items-center md:hidden gap-3">
        <button onClick={toggleMenu} className="p-2">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 flex flex-col items-start p-6 gap-4 md:hidden">
          <Link href="/" onClick={toggleMenu} className="hover:text-p-500">
            Home
          </Link>
          <Link
            href="/all-products"
            onClick={toggleMenu}
            className="hover:text-p-500"
          >
            Shop
          </Link>
          <Link
            href="/aboutus"
            onClick={toggleMenu}
            className="hover:text-p-500"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={toggleMenu}
            className="hover:text-p-500"
          >
            Contact
          </Link>

          {isSeller && (
            <button
              onClick={() => {
                router.push("/seller");
                toggleMenu();
              }}
              className="text-sm shadow px-4 py-2 rounded-full bg-gradient-to-l from-p-400 via-p-500 to-p-600 text-white"
            >
              Seller Dashboard
            </button>
          )}

          {user ? (
            <UserButton
              afterSignOutUrl="/"
<<<<<<< HEAD
=======
              userProfileMode="navigation"
              userProfileUrl="/user-profile"
>>>>>>> 7229a53716edf37d8dbe4c2f36237be3a0ea9108
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Cart"
                  labelIcon={<ShoppingCart size={16} />}
                  href="/cart"
                />
                <UserButton.Link
                  label="My Orders"
                  labelIcon={<Package size={16} />}
                  href="/my-orders"
                />
<<<<<<< HEAD
                <UserButton.Action
                  label="Manage Account"
                  action="manageAccount"
                />
=======
                <UserButton.Action label="manageAccount" />
>>>>>>> 7229a53716edf37d8dbe4c2f36237be3a0ea9108
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={() => {
                openSignIn();
                toggleMenu();
              }}
              className="flex items-center gap-2 hover:text-gray-900 transition"
            >
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
