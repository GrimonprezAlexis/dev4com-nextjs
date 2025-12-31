'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const MaintenanceBanner: React.FC = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMaintenanceStatus();
  }, []);

  const checkMaintenanceStatus = async () => {
    try {
      const docRef = doc(db, 'settings', 'maintenance');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setIsMaintenanceMode(docSnap.data().enabled || false);
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isMaintenanceMode || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <AlertTriangle size={24} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Mode Maintenance</h3>
                <p className="text-sm text-white/90">
                  Notre site est actuellement en maintenance. Certaines fonctionnalités peuvent être temporairement indisponibles.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 p-2 hover:bg-white/20 rounded-lg transition-colors ml-4"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MaintenanceBanner;
