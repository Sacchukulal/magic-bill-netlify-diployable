import { Utensils } from 'lucide-react';
import { Route } from '../types';

interface FooterProps {
  onNavigate: (route: Route) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:order-2 md:justify-start">
          <button onClick={() => onNavigate('terms')} className="text-slate-400 hover:text-slate-500 text-sm">Terms of Service</button>
          <button onClick={() => onNavigate('privacy')} className="text-slate-400 hover:text-slate-500 text-sm">Privacy Policy</button>
          <button onClick={() => onNavigate('refund')} className="text-slate-400 hover:text-slate-500 text-sm">Return Policy</button>
          <button onClick={() => onNavigate('contact')} className="text-slate-400 hover:text-slate-500 text-sm">Contact</button>
        </div>
        <div className="mt-8 md:order-1 md:mt-0 flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-slate-400" />
            <p className="text-center text-xs leading-5 text-slate-500">
              &copy; {new Date().getFullYear()} Magicbill, Inc. All rights reserved.
            </p>
          </div>
          <p className="text-xs leading-5 text-slate-400">
            Proudly made in Bangalore, Karnataka
          </p>
        </div>
      </div>
    </footer>
  );
}
