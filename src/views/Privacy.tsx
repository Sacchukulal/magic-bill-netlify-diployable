import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Route } from '../types';

export function Privacy({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-brand-200">
      <Header onNavigate={onNavigate} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <div className="space-y-8 text-slate-600">
          <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
          <div>
            <h3 className="text-slate-900 font-semibold mb-2 text-lg">1. Information We Collect</h3>
            <p>We collect information you provide directly to us when you create an account, such as your name, email address, password, and restaurant details. We also collect data about your orders, customers, and transactions processed through Magicbill.</p>
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold mb-2 text-lg">2. How We Use Your Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, and to send you technical notices and support messages.</p>
          </div>
          <div>
             <h3 className="text-slate-900 font-semibold mb-2 text-lg">3. Data Security</h3>
             <p>We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
          </div>
          <div>
             <h3 className="text-slate-900 font-semibold mb-2 text-lg">4. Sharing of Information</h3>
             <p>We do not share your personal information with third parties except as necessary to provide our services or as required by law.</p>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
