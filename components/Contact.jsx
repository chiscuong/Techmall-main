"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  Shield,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/create/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Reset sau 3s
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (error) {
      alert("❌ Error sending message: " + error.message);
    }
  };

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

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      info: "0949543448",
      subInfo: "Mon-Fri 9AM-6PM EST",
      color: "text-blue-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      info: "phamchiscuong@gmail.com",
      subInfo: "We'll respond within 24 hours",
      color: "text-green-500",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "anphudong",
      subInfo: "TP.HCM,12 dictrict",
      color: "text-purple-500",
    },
    {
      icon: Clock,
      title: "Business Hours",
      info: "Mon-Fri: 9:00 AM - 6:00 PM",
      subInfo: "Sat-Sun: 10:00 AM - 4:00 PM",
      color: "text-orange-500",
    },
  ];

  const features = [
    { icon: Headphones, text: "24/7 Customer Support" },
    { icon: Shield, text: "100% Secure & Private" },
    { icon: Users, text: "Expert Tech Team" },
    { icon: Star, text: "5-Star Rated Service" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-p-50 to-p-100">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 px-6 md:px-16 lg:px-32 text-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-40 h-40 bg-p-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-p-400 rounded-full blur-2xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-block p-4 bg-p-700 rounded-2xl mb-8 shadow-lg"
          >
            <MessageSquare size={40} className="text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-p-900 mb-6 leading-tight">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-p-600 to-p-800">
              Touch
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-p-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
              >
                <Icon size={16} className="text-p-600" />
                <span className="text-sm font-medium text-p-800">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Contact Form & Info Section */}
      <div className="py-20 px-6 md:px-16 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl border border-p-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-p-700 to-p-800 p-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Send us a Message
                </h2>
                <p className="text-p-100">
                  We'll get back to you within 24 hours
                </p>
              </div>

              <div className="p-8">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-semibold text-p-800 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800"
                          placeholder="John Doe"
                          required
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-semibold text-p-800 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800"
                          placeholder="john@example.com"
                          required
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-p-800 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 text-p-800"
                        placeholder="How can we help you?"
                        required
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-p-800 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-p-200 rounded-xl outline-none focus:border-p-600 focus:ring-4 focus:ring-p-200 transition-all duration-300 resize-none text-p-800"
                        placeholder="Tell us more about your inquiry..."
                        required
                      ></textarea>
                    </motion.div>

                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-p-700 to-p-800 text-white rounded-xl font-semibold text-lg hover:from-p-800 hover:to-p-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <Send size={20} />
                      Send Message
                    </motion.button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-p-900 mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-p-600 leading-relaxed">
                      Thank you for reaching out. We've received your message
                      and will get back to you within 24 hours.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-p-900 mb-6">
                  Let's Start a Conversation
                </h2>
                <p className="text-xl text-p-600 leading-relaxed">
                  Our friendly team is here to help you with any questions about
                  our products or services.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {contactInfo.map(
                  ({ icon: Icon, title, info, subInfo, color }, index) => (
                    <motion.div
                      key={title}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-p-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-p-50 ${color}`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-p-900 mb-2">{title}</h3>
                          <p className="text-p-700 font-medium mb-1">{info}</p>
                          <p className="text-p-500 text-sm">{subInfo}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>

              {/* FAQ Section */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-p-800 to-p-900 rounded-2xl p-8 text-white"
              >
                <h3 className="text-2xl font-bold mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      How long is shipping?
                    </h4>
                    <p className="text-p-200 text-sm">
                      Most orders ship within 24 hours and arrive in 3-5
                      business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      Do you offer warranty?
                    </h4>
                    <p className="text-p-200 text-sm">
                      Yes, all products come with manufacturer warranty plus our
                      30-day guarantee.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I return items?</h4>
                    <p className="text-p-200 text-sm">
                      We offer hassle-free returns within 30 days of purchase.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 md:px-16 lg:px-32 bg-gradient-to-r from-p-700 to-p-900 text-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-p-100 mb-8 max-w-2xl mx-auto">
            Browse our amazing collection of tech products and find exactly what
            you're looking for.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-p-800 rounded-2xl font-bold text-lg hover:bg-p-50 transition-colors duration-300 shadow-lg"
          >
            <a href="/all-products">Shop Now</a>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
