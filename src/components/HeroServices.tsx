import { motion } from "framer-motion";
import {
  BotIcon,
  Code,
  Globe,
  Lightbulb,
  Music,
  PenTool,
  ShoppingCart,
} from "lucide-react";
import React from "react";

const services = [
  { icon: <Code size={28} />, title: "Site Web Moderne", delay: 0.1 },
  { icon: <ShoppingCart size={28} />, title: "E-commerce", delay: 0.2 },
  { icon: <BotIcon size={28} />, title: "Automatisation IA", delay: 0.3 },
  { icon: <Globe size={28} />, title: "Optimisation SEO", delay: 0.8 },

  { icon: <PenTool size={28} />, title: "Identité Visuelle", delay: 0.2 },
  { icon: <Lightbulb size={28} />, title: "Consulting", delay: 0.4 },
  { icon: <PenTool size={28} />, title: "Maintenance & Support", delay: 1.0 },
  { icon: <Music size={28} />, title: "Playlist Personnalisée", delay: 0.4 },
];

const ServiceItem = ({ icon, title, delay }: any) => (
  <motion.div
    className="flex flex-col items-center"
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
  >
    <motion.div
      className="w-16 h-16 flex items-center justify-center text-white mb-2"
      whileHover={{ scale: 1.1, y: -5 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {icon}
    </motion.div>
    <p className="text-white text-sm text-center font-medium">{title}</p>
  </motion.div>
);

const HeroServices: React.FC = () => {
  return (
    <section className="bg-black py-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Nos Services
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Des solutions digitales clé en main pour booster votre activité.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
          {services.map((item, index) => (
            <ServiceItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroServices;
