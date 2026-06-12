import React, { useState, useEffect } from 'react';
import { LogOut, User, Mail, Shield, AlertCircle, Save } from 'lucide-react';
import { Route } from '../types';
import { auth, logout, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Header } from '../components/Header';

interface ProfileProps {
  onNavigate: (route: Route) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile form state
  const [mobileNumber, setMobileNumber] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.mobileNumber) setMobileNumber(data.mobileNumber);
            if (data.restaurantName) setRestaurantName(data.restaurantName);
            if (data.subscription) setSubscription(data.subscription);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        mobileNumber,
        restaurantName,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
    } catch (error) {
      console.error("Error saving profile", error);
      setMessage({ type: 'error', text: 'Failed to save profile details.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('home');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // Fallback demo user if bypassed without Firebase
  const displayUser = user || {
    displayName: 'Demo User',
    email: 'demo@example.com',
    uid: 'demo-uid-12345',
    photoURL: null
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header onNavigate={onNavigate} />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-slate-200">
          <div className="bg-brand-600/10 h-32 flex items-center justify-center relative">
            <div className="absolute -bottom-12 w-24 h-24 rounded-full border-4 border-white bg-brand-100 flex items-center justify-center overflow-hidden shadow-sm">
              {displayUser.photoURL ? (
                <img src={displayUser.photoURL} alt={displayUser.displayName || 'Profile'} className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-brand-600" />
              )}
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-6 sm:px-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {displayUser.displayName || 'User'}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {displayUser.email || 'No email provided'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Account Info</h3>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50 ring-1 ring-slate-100 shadow-sm">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-slate-900">{displayUser.email || 'Not available'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50 ring-1 ring-slate-100 shadow-sm">
                  <Shield className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Status</p>
                    <p className={`text-sm font-medium flex items-center gap-1.5 capitalize ${
                        subscription?.status === 'active' || subscription?.status === 'created_or_active_pending_verification' 
                          ? 'text-emerald-600' 
                          : subscription?.status 
                            ? 'text-amber-600' 
                            : 'text-slate-600'
                      }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        subscription?.status === 'active' || subscription?.status === 'created_or_active_pending_verification' 
                          ? 'bg-emerald-500' 
                          : subscription?.status 
                            ? 'bg-amber-500' 
                            : 'bg-slate-400'
                      }`}></span>
                      {subscription?.status === 'created_or_active_pending_verification' 
                        ? 'Active' 
                        : (subscription?.status || 'Free Tier')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-brand-50 ring-1 ring-brand-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                      <span className="font-bold text-xs">₹</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Current Plan</p>
                      <p className="text-sm font-medium text-slate-900 capitalize">
                        {subscription?.status === 'active' || subscription?.status === 'created_or_active_pending_verification' ? (subscription?.planId === 'tier-yearly' ? 'Yearly Pro' : 'Monthly Pro') : 'Free Tier'}
                      </p>
                      {(subscription?.status === 'active' || subscription?.status === 'created_or_active_pending_verification') && subscription?.nextBillingDate && (
                        <p className="text-xs text-slate-500 mt-0.5">Renews {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {subscription?.status === 'active' || subscription?.status === 'created_or_active_pending_verification' ? (
                      <button 
                        onClick={async () => {
                          if (!window.confirm("Are you sure you want to cancel your subscription?")) return;
                          try {
                            const res = await fetch('/api/subscription/cancel', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ subscriptionId: subscription.id })
                            });
                            if (!res.ok) throw new Error("Failed to cancel");
                            
                            // Update local db
                            await setDoc(doc(db, 'users', user.uid), {
                              subscription: {
                                ...subscription,
                                status: 'cancelled',
                                updatedAt: new Date().toISOString()
                              }
                            }, { merge: true });

                            alert("Subscription cancelled successfully.");
                            window.location.reload();
                          } catch (e: any) {
                            alert("Error cancelling subscription: " + e.message);
                          }
                        }} 
                        className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-white border border-rose-200 px-2.5 py-1.5 rounded-md shadow-sm transition-colors"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-xs font-bold text-white hover:bg-brand-500 bg-brand-600 px-2.5 py-1.5 rounded-md shadow-sm transition-colors">
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50 ring-1 ring-slate-100 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-slate-400" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User ID</p>
                    <p className="text-xs font-mono text-slate-600 truncate">{displayUser.uid}</p>
                  </div>
                </div>
              </div>
              
              {/* Business Details Form */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Business Details</h3>
                
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label htmlFor="restaurantName" className="block text-sm font-medium leading-6 text-slate-900">
                      Restaurant Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="restaurantName"
                        name="restaurantName"
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="e.g. The Spicy Kitchen"
                        className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium leading-6 text-slate-900">
                      Mobile Number
                    </label>
                    <div className="mt-1">
                      <input
                        id="mobileNumber"
                        name="mobileNumber"
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  
                  {message && (
                    <div className={`p-3 rounded-md text-sm font-medium ${
                      message.type === 'success' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-800 ring-1 ring-rose-200'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={saving || (!user && process.env.NODE_ENV !== 'development')}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? (
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Details
                    </button>
                    {!user && process.env.NODE_ENV !== 'development' && (
                      <p className="mt-2 text-xs text-center text-slate-500">Sign in to save your details</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
