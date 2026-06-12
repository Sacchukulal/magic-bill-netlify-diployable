import { useState } from 'react';
import { Check, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { Route } from '../types';

interface PricingProps {
  onNavigate: (route: Route) => void;
}

const commonFeatures = [
  'Real-Time Dashboard',
  'Smart Billing System',
  'Expense Tracking',
  'Sales Reports',
  'Menu Management',
  'Staff Management',
  'Business Settings',
  'Bill Customization',
  'Printer Integration',
  'Operational Controls'
];

const tiers = [
  {
    name: 'Daily Pass (Demo)',
    id: 'tier-daily',
    href: '#',
    price: { original: '₹30', current: '₹15' },
    description: 'Internal testing & demo only. No automatic payment. Contact us to get access.',
    features: commonFeatures,
    mostPopular: false,
    cycle: '/day',
    discount: 50
  },
  {
    name: 'Monthly Pro',
    id: 'tier-monthly',
    href: '#',
    price: { original: '₹900', current: '₹299' },
    description: 'Everything you need to run your growing restaurant efficiently.',
    features: commonFeatures,
    mostPopular: true,
    cycle: '/mo',
    discount: 67
  },
  {
    name: 'Yearly Pro',
    id: 'tier-yearly',
    href: '#',
    price: { original: '₹11000', current: '₹2999' },
    description: 'Best value for established restaurants looking for long-term growth.',
    features: commonFeatures,
    mostPopular: false,
    cycle: '/yr',
    discount: 73
  }
];

export function Pricing({ onNavigate }: PricingProps) {
  const [selectedPlan, setSelectedPlan] = useState('tier-monthly');

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white relative">
      <div className="absolute inset-0 bg-slate-50/50 -skew-y-3 origin-top-left -z-10"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-600">Pricing</h2>
          <p className="mt-2 text-4xl font-display font-bold tracking-tight text-slate-900 sm:text-5xl">
            Choose the right plan for your restaurant
          </p>
        </div>
        
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
          Simple, transparent pricing that grows with your business. No hidden fees.
        </p>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, index) => {
            const isSelected = selectedPlan === tier.id;
            return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedPlan(tier.id)}
              key={tier.id}
              className={`cursor-pointer rounded-3xl p-8 xl:p-10 transition-all duration-300 ${
                isSelected 
                  ? 'bg-slate-900 text-white ring-1 ring-slate-900 shadow-xl lg:scale-105 z-10' 
                  : 'ring-1 ring-slate-300 bg-white shadow-sm hover:shadow-md hover:ring-brand-500/50 relative z-0'
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform z-20">
                  <span className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold leading-6 shadow-sm whitespace-nowrap ${isSelected ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700 ring-1 ring-inset ring-brand-200'}`}>
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between gap-x-4">
                <h3 className={`text-lg font-semibold leading-8 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {tier.name}
                </h3>
              </div>
              
              <p className={`mt-4 text-sm leading-6 h-12 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                {tier.description}
              </p>
              
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className={`text-4xl font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {tier.price.current}
                </span>
                <span className="text-sm font-semibold leading-6 text-slate-500 line-through mr-1">
                  {tier.price.original}
                </span>
                <span className={`text-sm font-semibold leading-6 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tier.cycle}
                </span>
              </p>
              
              <motion.div 
                initial={false}
                animate={isSelected ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`mt-3 flex items-center w-fit gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm transition-colors ${isSelected ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}
              >
                <Tag className="w-4 h-4" />
                {tier.discount}% OFF
              </motion.div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSelected) {
                    setSelectedPlan(tier.id);
                  } else {
                    if (tier.id === 'tier-daily') {
                      onNavigate('demo-request');
                    } else {
                      localStorage.setItem('selectedPlan', tier.id);
                      onNavigate('subscription');
                    }
                  }
                }}
                aria-describedby={tier.id}
                className={`mt-8 block w-full rounded-md px-3 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform active:scale-95 shadow-sm ${
                  isSelected 
                    ? 'bg-brand-500 text-white hover:bg-brand-400 focus-visible:outline-brand-500' 
                    : 'bg-white text-brand-600 hover:bg-slate-50 ring-1 ring-inset ring-brand-200 hover:ring-brand-300'
                }`}
              >
                {isSelected ? 'Get started' : 'Select Plan'}
              </button>
              
              <ul className={`mt-8 space-y-3 text-sm leading-6 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className={`h-6 w-5 flex-none ${isSelected ? 'text-brand-400' : 'text-brand-600'}`} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
