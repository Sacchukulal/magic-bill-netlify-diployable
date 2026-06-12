import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Route } from '../types';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Contact({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-brand-200">
      <Header onNavigate={onNavigate} />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 mb-12">Have questions about Magicbill? Our team in Bangalore is here to help you run your restaurant better.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="bg-brand-50 p-3 rounded-lg text-brand-600 mt-1">
               <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Office Location</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Magicbill Software<br/>
                Koramangala, Bangalore<br/>
                Karnataka, India<br/>
                PIN: 560034
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
              <div className="bg-brand-50 p-3 rounded-lg text-brand-600 mt-1">
                 <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Email Support</h3>
                <a href="mailto:support@magicbill.in" className="text-brand-600 hover:text-brand-700 text-sm font-medium">support@magicbill.in</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
              <div className="bg-brand-50 p-3 rounded-lg text-brand-600 mt-1">
                 <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Phone Number</h3>
                <a href="tel:+918000000000" className="text-brand-600 hover:text-brand-700 text-sm font-medium">+91 800 000 0000</a>
                <p className="text-slate-500 text-xs mt-1">Mon-Sat, 9AM to 6PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
