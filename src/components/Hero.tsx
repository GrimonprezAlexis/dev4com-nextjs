"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import HeroServices from "./HeroServices";

const Hero: React.FC = () => {
  const sections = [
    {
      title: "Contact",
      description:
        "Parlons de votre projet et créons ensemble une solution sur mesure.",
      image: "/images/contact.png",
      link: "/contact",
    },
    {
      title: "Services",
      description:
        "Découvrez nos services de développement web et digital sur mesure.",
      image: "/images/services.png",
      link: "/services",
    },
        {
      title: "Projets",
      description:
        "Découvrez nos réalisations et projets qui ont transformé la présence digitale de nos clients.",
      image: "/images/projets.png",
      link: "/projets",
    },

    {
      title: "Admin",
      description:
        "Accédez à l'interface d'administration pour gérer votre site web.",
      image: "/images/admin.png",
      link: "/admin",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 md:mt-0 p-4">
        {sections.map((section, index) => (
          <Link href={section.link} key={section.title}>
            <motion.div
              className="relative overflow-hidden group cursor-pointer rounded-xl h-[300px] md:h-[calc(100vh-2rem)]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 z-10 opacity-70 transition-opacity duration-300 group-hover:opacity-40" />

              {/* Background image */}
              <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority={index < 2}
                  quality={75}
                />
              </motion.div>

              {/* Content */}
              <div className="relative z-30 h-full flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  className="backdrop-blur-sm p-6 rounded-xl transform transition-all duration-300 group-hover:scale-105 border border-white/10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                >
                  <motion.h2
                    className="text-4xl font-bold mb-4 font-sans tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.3 }}
                  >
                    {section.title}
                  </motion.h2>

                  <motion.p
                    className="text-base leading-relaxed text-white/90 transform transition-all duration-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.4 }}
                  >
                    {section.description}
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      <HeroServices />
    </div>
  );
};

export default Hero;
