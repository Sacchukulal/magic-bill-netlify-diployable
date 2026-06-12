import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Route } from '../types';

export function RefundPolicy({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-brand-200">
      <Header onNavigate={onNavigate} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Payment and Return Policy</h1>
        <div className="space-y-6 text-slate-600">
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-6">
            <h3 className="text-brand-900 font-semibold mb-2">No Returns on Software Subscriptions</h3>
            <p className="text-brand-800 text-sm">As Magicbill is a digital software-as-a-service (SaaS) product, we do not issue refunds for payments once they are made. All subscription payments (monthly and yearly) are final.</p>
          </div>
          
          <div>
            <h3 className="text-slate-900 font-semibold mb-2 text-lg">Subscription Cancellation</h3>
            <p>You can cancel your monthly or yearly subscription at any time. Once cancelled, you will retain access to Magicbill until the end of your current paid billing cycle. We do not provide prorated refunds for mid-cycle cancellations.</p>
          </div>
          
          <div>
            <h3 className="text-slate-900 font-semibold mb-2 text-lg">Auto-Renewal Management</h3>
            <p>By default, your subscription will automatically renew at the end of each billing cycle to ensure uninterrupted service. You have full control over auto-renewal and can toggle it ON or OFF at any time from your billing dashboard settings.</p>
          </div>
          
          <div>
            <h3 className="text-slate-900 font-semibold mb-2 text-lg">Trial Periods</h3>
            <p>If you are on a free trial or using the Daily Pass, you can evaluate the software before committing to a monthly or yearly subscription. We encourage you to test Magicbill thoroughly during this period.</p>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
