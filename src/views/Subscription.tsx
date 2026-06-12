import { useState, useEffect } from 'react';
import { Route } from '../types';
import { Header } from '../components/Header';
import { Check, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface SubscriptionProps {
  onNavigate: (route: Route) => void;
}

const planDetails = {
  'tier-monthly': { name: 'Monthly Pro', price: '₹299', amount: 299, cycle: 'per month' },
  'tier-yearly': { name: 'Yearly Pro', price: '₹2999', amount: 2999, cycle: 'per year' },
};

export function Subscription({ onNavigate }: SubscriptionProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dbPhone, setDbPhone] = useState<string | null>(null);

  const selectedPlanId = localStorage.getItem('selectedPlan') || 'tier-monthly';
  const plan = planDetails[selectedPlanId as keyof typeof planDetails];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch current subscription status
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentSub(data.subscription);
          if (data.mobileNumber) {
            setPhoneNumber(data.mobileNumber);
            setDbPhone(data.mobileNumber);
          }
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    setCheckingOut(true);
    try {
      // Create subscription on server
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlanId, uid: user.uid })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create subscription');

      const rzpKeyId = data.rzp_client_key_id;
      if (!rzpKeyId) {
        throw new Error("Razorpay Key ID is not returned from the server.");
      }
      
      const options = {
        key: rzpKeyId,
        subscription_id: data.id,
        name: "Magicbill",
        description: `${plan.name} Subscription`,
        handler: async function (response: any) {
          // Update DB immediately on the client side just in case webhook is delayed
          try {
            await setDoc(doc(db, 'users', user.uid), {
              subscription: {
                id: data.id,
                planId: selectedPlanId,
                status: 'created_or_active_pending_verification',
                updatedAt: new Date().toISOString()
              }
            }, { merge: true });
            // For robust verification, Razorpay webhook will update status to 'active'
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (e) {
            console.error(e);
          }
        },
        prefill: {
          ...(user.displayName ? { name: user.displayName } : {}),
          ...(user.email ? { email: user.email } : {}),
          ...((phoneNumber || user.phoneNumber) ? { contact: phoneNumber || user.phoneNumber } : {}),
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
        alert("Payment Failed: " + response.error.description);
      });
      rzp1.open();

    } catch (e: any) {
      alert("Error initiating checkout: " + e.message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-brand-600 h-8 w-8" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-slate-200 p-8 sm:p-12">
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-500 mb-8 border-b border-slate-100 pb-8">Complete your subscription to unlock all features.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Selected Plan</h3>
              <div className="bg-brand-50 rounded-xl p-6 ring-1 ring-brand-200">
                <div className="font-bold text-xl text-brand-900">{plan.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-brand-700">{plan.price}</span>
                  <span className="text-sm text-brand-600 font-medium">{plan.cycle}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2 text-sm text-brand-800"><Check className="h-4 w-4 text-brand-500"/> Real-Time Dashboard</li>
                  <li className="flex items-center gap-2 text-sm text-brand-800"><Check className="h-4 w-4 text-brand-500"/> Smart Billing System</li>
                  <li className="flex items-center gap-2 text-sm text-brand-800"><Check className="h-4 w-4 text-brand-500"/> Infinite updates & support</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Payment Summary</h3>
              
              <div className="bg-slate-50 p-6 rounded-xl space-y-4 text-sm ring-1 ring-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600">Plan Amount</span>
                  <span className="font-medium text-slate-900">₹{plan.amount}.00</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-base">
                  <span className="text-slate-900">Total payable today</span>
                  <span className="text-brand-600">₹{plan.amount}.00</span>
                </div>
              </div>

              <div className="mt-8">
                {!user ? (
                  <button onClick={() => onNavigate('login')} className="w-full flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                    Sign in to Continue
                  </button>
                ) : currentSub && currentSub.status === 'active' ? (
                  <div className="text-center p-4 bg-emerald-50 ring-1 ring-emerald-200 rounded-lg">
                    <p className="text-emerald-800 font-semibold mb-2">You have an active subscription.</p>
                    <button onClick={() => onNavigate('profile')} className="text-sm text-brand-600 hover:underline">Manage in Profile</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {!(dbPhone || user?.phoneNumber) && (
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-3 py-2 border"
                        />
                      </div>
                    )}
                    <button 
                      disabled={checkingOut || (!phoneNumber && !user?.phoneNumber && !dbPhone)}
                      onClick={handleCheckout} 
                      className="w-full flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {checkingOut ? <Loader2 className="animate-spin h-5 w-5" /> : 'Proceed to Pay with Razorpay'}
                    </button>
                  </div>
                )}
                <p className="text-xs text-center text-slate-500 mt-4">By proceeding, you agree to a recurring auto-debit based on your plan cycle. You can cancel anytime.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
