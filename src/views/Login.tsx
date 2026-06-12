import { useState } from 'react';
import { Utensils, AlertCircle } from 'lucide-react';
import { Route } from '../types';
import { signInWithGoogle } from '../lib/firebase';

interface LoginProps {
  onNavigate: (route: Route) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 font-sans selection:bg-brand-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div 
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white overflow-hidden shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onNavigate('home')}
        >
          <img 
            src="/logo.png" 
            alt="Magicbill Logo" 
            className="w-full h-full object-cover z-10"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('fallback-icon');
            }}
          />
          <Utensils className="h-7 w-7 absolute z-0 hidden group-[.fallback-icon]:block" />
        </div>
        <h2 className="mt-6 text-center text-2xl font-display font-bold leading-9 tracking-tight text-slate-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-xl shadow-slate-200/40 sm:rounded-2xl sm:px-12 border border-slate-100">
          <div>
            <div className="mt-6 flex flex-col gap-4">
              <button
                disabled={isSigningIn}
                onClick={async () => {
                  if (isSigningIn) return;
                  setError(null);
                  setIsSigningIn(true);
                  try {
                    await signInWithGoogle();
                    onNavigate('profile');
                  } catch (err: any) {
                    setIsSigningIn(false);
                    console.error("Google sign in failed", err);
                    if (err.code === 'auth/popup-blocked') {
                      setError('Popup blocked by your browser. Please allow popups or open the app in a new tab.');
                    } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
                      // Silently ignore when the user simply closes the popup
                      setError(null);
                    } else if (err.code === 'auth/unauthorized-domain') {
                      setError(`auth/unauthorized-domain:${window.location.hostname}`);
                    } else {
                      setError(err.message || 'An error occurred during sign-in.');
                    }
                  }
                }}
                className={`flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:ring-transparent transition-colors ${isSigningIn ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.25024 6.60998L5.32028 9.76998C6.2753 6.63001 9.00028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L20.18 21.29C22.57 19.09 24 15.86 24 12V12.275H23.49Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.54998C0.46 8.17998 0 10.005 0 11.9999C0 13.9949 0.46 15.8199 1.28 17.4499L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 20.0654 20.965L15.9604 17.785C14.8504 18.515 13.5554 18.98 12.0004 18.98C8.8804 18.98 6.28041 16.96 5.38041 14.185L1.38037 17.305C3.40537 21.365 7.4204 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">Google</span>
              </button>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4 mt-4 text-left">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Sign-in Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error.startsWith('auth/unauthorized-domain:') ? (
                          <div className="space-y-3">
                            <p>This domain is not authorized for Firebase Auth. You must add it to your Firebase Console under <strong>Authentication &gt; Settings &gt; Authorized domains</strong>.</p>
                            <div className="bg-red-100 p-2 rounded-md font-mono text-xs flex justify-between items-center break-all">
                              <span>{error.split(':')[1]}</span>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigator.clipboard.writeText(error.split(':')[1]);
                                }}
                                className="ml-2 text-red-700 hover:text-red-900 px-2 py-1 rounded bg-red-200"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p>{error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Not a member?{' '}
          <a href="#" className="font-semibold leading-6 text-brand-600 hover:text-brand-500">
            Start a 14-day free trial
          </a>
        </p>
      </div>
    </div>
  );
}
