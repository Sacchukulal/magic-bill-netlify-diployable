import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Receipt, Users, Zap, Utensils, Download } from 'lucide-react';
import { Route } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface HeroProps {
  onNavigate: (route: Route) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSubscription(docSnap.data().subscription);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      alert("Please log in to download the app.");
      onNavigate('login');
      return;
    }
    
    const hasActivePlan = subscription?.status === 'active' || subscription?.status === 'created_or_active_pending_verification';
    const isMonthlyOrYearly = subscription?.planId === 'tier-monthly' || subscription?.planId === 'tier-yearly';

    if (!hasActivePlan || !isMonthlyOrYearly) {
      alert("Please activate a Monthly or Yearly plan to download the app.");
      // Optionally navigate to pricing
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Trigger download
    window.location.href = "https://github.com/Sacchukulal/magicbillreleaseapp/releases/download/v0.1.0/Magic.Bill_0.1.0_x64-setup.zip";
  };

  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-brand-500 opacity-20 blur-[100px]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-slate-200 bg-white px-7 py-2 shadow-sm backdrop-blur transition-all hover:border-slate-300 hover:bg-white/50 mb-8"
        >
          <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
          <p className="text-sm font-medium text-slate-700">Introducing Magicbill 2.0</p>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl"
        >
          Restaurant billing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-400">made effortless</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600"
        >
          Speed up your checkout, manage tables, and track inventory in real-time. Magicbill gives you everything you need to run your restaurant smoothly and grow your business.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-x-6"
        >
          <button 
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all hover:scale-105 active:scale-95"
          >
            Start Free Trial <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleDownloadClick}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="h-4 w-4" /> Download POS App (15MB)
          </button>

          <a href="#pricing" className="text-sm font-semibold leading-6 text-slate-900 hover:text-brand-600 transition-colors hidden sm:block">
            View Pricing <span aria-hidden="true">→</span>
          </a>
        </motion.div>

        {/* Dashboard Screenshot */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 mx-auto max-w-5xl rounded-xl sm:rounded-2xl bg-slate-900 p-2 sm:p-4 ring-1 ring-inset ring-slate-900/10 lg:rounded-3xl lg:p-4 shadow-2xl"
        >
          <div className="overflow-hidden rounded-lg sm:rounded-xl ring-1 ring-white/10">
            <img 
              src="/screenshot1.jpeg" 
              alt="Magicbill Dashboard view" 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
