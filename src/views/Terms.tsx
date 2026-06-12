import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Route } from '../types';

export function Terms({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-brand-200">
      <Header onNavigate={onNavigate} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Terms and Conditions</h1>
        <div className="space-y-8 text-slate-600">
          <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
          <p>Welcome to Magicbill. By using our restaurant billing software, you agree to these terms.</p>
          <div>
            <h3 className="text-slate-900 font-semibold mb-2 text-lg">1. License to Use</h3>
            <p>Magicbill grants you a non-exclusive, non-transferable license to use our software for your restaurant business, on a subscription basis.</p>
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold mb-2 text-lg">2. Subscription and Billing</h3>
            <p>Our service is billed on a monthly or yearly basis. You are responsible for maintaining accurate billing information.</p>
          </div>
          <div>
             <h3 className="text-slate-900 font-semibold mb-2 text-lg">3. Acceptable Use</h3>
             <p>You agree not to misuse the Magicbill software or help anyone else do so. You are responsible for all activities associated with your account.</p>
          </div>
          <div>
             <h3 className="text-slate-900 font-semibold mb-2 text-lg">4. Termination</h3>
             <p>We may suspend or terminate your access to the service if you violate these terms or fail to pay your subscription fees.</p>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
