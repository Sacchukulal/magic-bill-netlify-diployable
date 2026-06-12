import { useState, useEffect } from 'react';
import { Utensils, LogOut, User } from 'lucide-react';
import { Route } from '../types';
import { auth, logout } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  onNavigate: (route: Route) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('home');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="group flex h-8 w-8 relative items-center justify-center rounded-lg bg-brand-600 text-white overflow-hidden shadow-sm">
            <img 
              src="/logo.png" 
              alt="Magicbill Logo" 
              className="w-full h-full object-cover z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('fallback-icon');
              }}
            />
            <Utensils className="h-5 w-5 absolute z-0 hidden group-[.fallback-icon]:block" />
          </div>
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight">Magicbill</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('home'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-brand-600 transition-colors">Features</a>
          <a href="#screenshots" onClick={(e) => { e.preventDefault(); onNavigate('home'); setTimeout(() => document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-brand-600 transition-colors">Preview</a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); onNavigate('home'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-brand-600 transition-colors">Pricing</a>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors"
                title="Go to Profile"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <span className="hidden sm:block">{user.displayName || 'User'}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                title="Logout"
              >
                <span className="hidden sm:block">Logout</span>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
