import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10">
      <div className="flex items-center gap-4">
        <div className=" text-3xl font-bold bg-gradient-to-r from-p-400 via-p-500 to-p-800 text-transparent bg-clip-text">
          <h2>TechMall</h2>
        </div>
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          phamchiscuong
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a href="#">
          <Image src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#">
          <Image src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
          <Image src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
