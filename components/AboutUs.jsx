"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  Globe,
  Heart,
  Zap,
  Shield,
  Target,
  Star,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

const AboutUs = () => {
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

  const stats = [
    {
      icon: Users,
      number: "50K+",
      label: "Happy Customers",
      color: "text-blue-500",
    },
    {
      icon: Award,
      number: "99%",
      label: "Satisfaction Rate",
      color: "text-green-500",
    },
    {
      icon: Globe,
      number: "25+",
      label: "Countries Served",
      color: "text-purple-500",
    },
    {
      icon: Star,
      number: "4.9",
      label: "Average Rating",
      color: "text-yellow-500",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Every decision we make is centered around delivering exceptional value and service to our customers.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We continuously seek out the latest technology and trends to bring you cutting-edge products.",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Each product undergoes rigorous testing to ensure it meets our high standards for quality and reliability.",
    },
    {
      icon: Target,
      title: "Precision",
      description:
        "We carefully curate our selection to offer only the best products that truly make a difference.",
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description: "Started with a vision to democratize premium technology",
    },
    {
      year: "2020",
      title: "Global Expansion",
      description: "Expanded to serve customers across 25+ countries",
    },
    {
      year: "2022",
      title: "50K Milestone",
      description: "Reached 50,000 satisfied customers worldwide",
    },
    {
      year: "2024",
      title: "Innovation Award",
      description: "Recognized for excellence in customer experience",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/api/placeholder/300/300",
      description: "15+ years in tech industry",
    },
    {
      name: "Mike Chen",
      role: "Head of Product",
      image: "/api/placeholder/300/300",
      description: "Expert in consumer electronics",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success",
      image: "/api/placeholder/300/300",
      description: "Passionate about customer experience",
    },
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
            <Heart size={40} className="text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-p-900 mb-6 leading-tight">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-p-600 to-p-800">
              Our Story
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-p-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            We're on a mission to bring you the world's best technology
            products, carefully curated and delivered with exceptional service.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-p-700 to-p-800 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Explore Products
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-6 md:px-16 lg:px-32 bg-white"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map(({ icon: Icon, number, label, color }, index) => (
            <motion.div
              key={label}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="text-center p-6 bg-gradient-to-br from-p-50 to-p-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`inline-block p-4 bg-white rounded-xl mb-4 shadow-md ${color}`}
              >
                <Icon size={32} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-p-900 mb-2">
                {number}
              </div>
              <div className="text-p-600 font-medium">{label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Our Story Section */}
      <div className="py-20 px-6 md:px-16 lg:px-32 bg-gradient-to-r from-p-800 to-p-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Our Journey</h2>
          <p className="text-xl text-p-200 leading-relaxed mb-12">
            What started as a passion project in 2018 has grown into a global
            platform trusted by thousands of customers worldwide. We believe
            that everyone deserves access to premium technology that enhances
            their daily lives.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Target className="text-orange-400" size={24} />
                Our Mission
              </h3>
              <p className="text-p-100 leading-relaxed">
                To democratize access to premium technology by providing
                carefully curated products that enhance productivity,
                entertainment, and quality of life for everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Globe className="text-blue-400" size={24} />
                Our Vision
              </h3>
              <p className="text-p-100 leading-relaxed">
                To become the world's most trusted platform for discovering and
                purchasing innovative technology products that inspire and
                empower users globally.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 md:px-16 lg:px-32 bg-white"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-p-900 mb-6">
            Our Values
          </h2>
          <p className="text-xl text-p-600 max-w-3xl mx-auto">
            These core principles guide everything we do and shape our
            commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {values.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="text-center p-6 bg-gradient-to-br from-p-50 to-p-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="inline-block p-4 bg-p-700 rounded-2xl mb-6 group-hover:bg-p-800 transition-colors duration-300 shadow-lg">
                <Icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-p-900 mb-4">{title}</h3>
              <p className="text-p-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Section */}
      <div className="py-20 px-6 md:px-16 lg:px-32 bg-gradient-to-b from-p-50 to-p-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-p-900 mb-6">
            Our Milestones
          </h2>
          <p className="text-xl text-p-600 max-w-3xl mx-auto">
            Key moments that shaped our journey to becoming a trusted technology
            partner.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`flex items-center gap-8 mb-12 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-4 py-2 bg-p-700 text-white rounded-full font-bold mb-4">
                  {milestone.year}
                </div>
                <h3 className="text-2xl font-bold text-p-900 mb-2">
                  {milestone.title}
                </h3>
                <p className="text-p-600 leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              <div className="w-4 h-4 bg-p-700 rounded-full shadow-lg"></div>

              <div className="flex-1"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 md:px-16 lg:px-32 bg-white"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-p-900 mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl text-p-600 max-w-3xl mx-auto">
            The passionate individuals behind our success, dedicated to bringing
            you the best technology experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="text-center p-6 bg-gradient-to-br from-p-50 to-p-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-p-300 to-p-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-xl font-bold text-p-900 mb-2">
                {member.name}
              </h3>
              <p className="text-p-700 font-medium mb-3">{member.role}</p>
              <p className="text-p-600 text-sm">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <div className="py-20 px-6 md:px-16 lg:px-32 bg-gradient-to-br from-p-800 to-p-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why Choose Us?
            </h2>
            <p className="text-xl text-p-200 max-w-3xl mx-auto">
              We're not just another e-commerce platform. Here's what makes us
              different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Quality Guaranteed",
                description:
                  "Every product comes with our quality promise and warranty protection.",
              },
              {
                icon: TrendingUp,
                title: "Best Prices",
                description:
                  "Competitive pricing with regular discounts and exclusive member deals.",
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                description:
                  "Quick and reliable shipping with real-time tracking for peace of mind.",
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Icon size={32} className="text-orange-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-p-200 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 md:px-16 lg:px-32 bg-gradient-to-r from-p-600 to-p-800 text-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-p-100 mb-8 max-w-2xl mx-auto">
            Discover amazing products, enjoy exclusive deals, and become part of
            our growing family of satisfied customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-p-800 rounded-2xl font-bold text-lg hover:bg-p-50 transition-colors duration-300 shadow-lg"
            >
              Start Shopping
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
