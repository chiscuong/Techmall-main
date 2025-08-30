import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="bg-gradient-to-br from-p-300 via-p-400 to-p-450 text-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full blur-xl"></div>
      </div>

      {/* Main Footer Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-6 md:px-16 lg:px-32 pt-16 pb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <a href="#" className=" text-5xl ">
              <h2 className="bg-neu-800 text-transparent bg-clip-text font-bold ">
                TechMall
              </h2>
            </a>
            <p className="text-neu-600 leading-relaxed mb-6 max-w-md">
              We're passionate about bringing you the latest in technology and
              lifestyle products. From premium audio gear to cutting-edge
              electronics, we curate only the best for our customers.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-neu-600 mr-2">Follow us:</span>
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "Youtube" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-neu-700 rounded-full hover:bg-neu-600 transition-colors duration-300"
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg text-neu-600 mb-6 flex items-center gap-2">
              <ArrowRight size={20} className="text-neu-600" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { text: "Home", href: "/" },
                { text: "All Products", href: "/products" },
                { text: "About Us", href: "/about" },
                { text: "Contact", href: "/contact" },
                { text: "Privacy Policy", href: "/privacy" },
                { text: "Terms of Service", href: "/terms" },
              ].map(({ text, href }) => (
                <li key={text}>
                  <motion.a
                    href={href}
                    whileHover={{ x: 5 }}
                    className="text-neu-600 hover:text-neu-500 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-neu-600 rounded-full group-hover:bg-neu-700 transition-colors duration-300"></div>
                    {text}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg text-neu-600 mb-6 flex items-center gap-2">
              <Phone size={20} className="text-neu-500" />
              Get in Touch
            </h3>
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-neu-600 hover:text-neu-700 transition-colors duration-300"
              >
                <Phone size={16} className="text-neu-600" />
                <span>079473463</span>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-neu-600 hover:text-neu-700 transition-colors duration-300"
              >
                <Mail size={16} className="text-neu-600" />
                <span>phamchiscuong@gmail.com</span>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 text-neu-600 hover:text-neu-700 transition-colors duration-300"
              >
                <MapPin size={16} className="text-neu-600 mt-0.5" />
                <span className="leading-relaxed">
                  an phu dong
                  <br />
                  quan 12
                  <br />
                  tp.HCM
                </span>
              </motion.div>
            </div>

            {/* Newsletter Signup */}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 pt-8 border-t border-p-700/50 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className=" text-neu-600 text-sm">phamhchiscuong</p>

          <div className="flex items-center gap-6 text-sm">
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="text-neu-600 hover:text-neu-700 transition-colors duration-300"
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="text-neu-600 hover:text-neu-700 transition-colors duration-300"
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="text-neu-600 hover:text-neu-700 transition-colors duration-300"
            >
              Cookie Policy
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
