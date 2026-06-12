import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { AppScreenshots } from '../components/AppScreenshots';
import { Pricing } from '../components/Pricing';
import { Footer } from '../components/Footer';
import { Route } from '../types';

interface LandingPageProps {
  onNavigate: (route: Route) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-brand-200">
      <Header onNavigate={onNavigate} />
      <main>
        <Hero onNavigate={onNavigate} />
        <Features />
        <div id="screenshots">
          <AppScreenshots />
        </div>
        <Pricing onNavigate={onNavigate} />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
