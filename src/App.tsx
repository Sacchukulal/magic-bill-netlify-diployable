import { useState } from 'react';
import { Route } from './types';
import { LandingPage } from './views/LandingPage';
import { Profile } from './views/Profile';
import { Terms } from './views/Terms';
import { Privacy } from './views/Privacy';
import { RefundPolicy } from './views/RefundPolicy';
import { Contact } from './views/Contact';
import { Login } from './views/Login';
import { Subscription } from './views/Subscription';
import { DemoRequest } from './views/DemoRequest';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');

  return (
    <>
      {currentRoute === 'home' && <LandingPage onNavigate={setCurrentRoute} />}
      {currentRoute === 'profile' && <Profile onNavigate={setCurrentRoute} />}
      {currentRoute === 'login' && <Login onNavigate={setCurrentRoute} />}
      {currentRoute === 'terms' && <Terms onNavigate={setCurrentRoute} />}
      {currentRoute === 'privacy' && <Privacy onNavigate={setCurrentRoute} />}
      {currentRoute === 'refund' && <RefundPolicy onNavigate={setCurrentRoute} />}
      {currentRoute === 'contact' && <Contact onNavigate={setCurrentRoute} />}
      {currentRoute === 'subscription' && <Subscription onNavigate={setCurrentRoute} />}
      {currentRoute === 'demo-request' && <DemoRequest onNavigate={setCurrentRoute} />}
    </>
  );
}
