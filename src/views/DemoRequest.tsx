import React, { useState, useEffect } from 'react';
import { Route } from '../types';
import { Header } from '../components/Header';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface DemoRequestProps {
  onNavigate: (route: Route) => void;
}

export function DemoRequest({ onNavigate }: DemoRequestProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [businessType, setBusinessType] = useState('Restaurant');
  const [averageBills, setAverageBills] = useState('0-50');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setName(u.displayName || '');
        setEmail(u.email || '');
        // Fetch existing data if any
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.mobileNumber) setPhone(data.mobileNumber);
          if (data.restaurantName) setRestaurantName(data.restaurantName);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      // Save demo request
      await setDoc(doc(db, 'demo_requests', user.uid), {
        uid: user.uid,
        name,
        phone,
        email,
        restaurantName,
        businessType,
        averageBills,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // Update user profile fields so they don't have to fill them out again
      await setDoc(doc(db, 'users', user.uid), {
        mobileNumber: phone,
        restaurantName: restaurantName,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting demo request", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-brand-600 h-8 w-8" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-200">
      <Header onNavigate={onNavigate} />
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-8 sm:p-10">
          {!user ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">Request Daily Pass Demo</h1>
              <p className="text-slate-600 mb-8">Please log in to request a demo pass for Magicbill.</p>
              <button 
                onClick={() => onNavigate('login')}
                className="inline-flex justify-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 transition-colors"
              >
                Sign in to Continue
              </button>
            </div>
          ) : submitted ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h2>
              <p className="text-slate-600 mb-8">Thank you, {name}. Our team will contact you shortly to activate your daily pass demo.</p>
              <button 
                onClick={() => onNavigate('home')}
                className="text-sm font-semibold text-brand-600 hover:text-brand-500"
              >
                &larr; Return to Home
              </button>
            </div>
          ) : (
            <>
              <div className="mb-10 border-b border-slate-100 pb-8">
                <h1 className="text-2xl font-bold text-slate-900">Request Daily Pass Demo</h1>
                <p className="mt-2 text-slate-500">The daily pass is currently for internal testing and demo purposes. Please provide your business details and our team will get back to you to activate it.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">Your Name</label>
                    <div className="mt-2">
                      <input type="text" id="name" required value={name} onChange={e => setName(e.target.value)} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-slate-900">Phone Number</label>
                    <div className="mt-2">
                      <input type="tel" id="phone" required value={phone} onChange={e => setPhone(e.target.value)} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">Email Address</label>
                  <div className="mt-2">
                    <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div>
                  <label htmlFor="restaurantName" className="block text-sm font-medium leading-6 text-slate-900">Business Name</label>
                  <div className="mt-2">
                    <input type="text" id="restaurantName" required value={restaurantName} onChange={e => setRestaurantName(e.target.value)} placeholder="e.g. The Spicy Kitchen" className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium leading-6 text-slate-900">Business Type</label>
                    <div className="mt-2">
                      <select id="businessType" value={businessType} onChange={e => setBusinessType(e.target.value)} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option>Restaurant</option>
                        <option>Cafe / Bakery</option>
                        <option>Retail / Grocery</option>
                        <option>Food Truck</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="averageBills" className="block text-sm font-medium leading-6 text-slate-900">Average Bills / Day</label>
                    <div className="mt-2">
                      <select id="averageBills" value={averageBills} onChange={e => setAverageBills(e.target.value)} className="block w-full rounded-md border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option>0 - 50</option>
                        <option>50 - 200</option>
                        <option>200 - 500</option>
                        <option>500+</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-x-6">
                  <button type="button" onClick={() => onNavigate('home')} className="text-sm font-semibold leading-6 text-slate-900 hover:text-slate-600">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 transition-colors flex items-center gap-2">
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit Request
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
